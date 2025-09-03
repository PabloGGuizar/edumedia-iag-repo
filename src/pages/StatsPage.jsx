import { useState, useEffect } from 'react';
import Papa from 'papaparse';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSj_hltRI4Q0QolINWJVcKxCMMjfpdiCkKzSdgp9d8RlGTdUU1UIKvaj-TBSkq0JQGneDhfUkSQuFzy/pub?output=csv';

// Helper functions for data processing
const countMultiValueItems = (data, columnName) => {
    const counts = {};
    data.forEach(row => {
        const items = row[columnName];
        if (items) {
            items.split(',').forEach(item => {
                const trimmedItem = item.trim();
                if (trimmedItem) {
                    counts[trimmedItem] = (counts[trimmedItem] || 0) + 1;
                }
            });
        }
    });
    return counts;
};

const countSingleValueItems = (data, columnName) => {
    const counts = {};
    data.forEach(row => {
        const item = row[columnName]?.trim();
        if (item) {
            counts[item] = (counts[item] || 0) + 1;
        }
    });
    return counts;
};

const processChartData = (csvData) => {
    // This logic is adapted from the original est_apl.html script
    const allData = csvData.slice(1).map(row => ({
        timestamp: row[0], correo_autor: row[1], nombre_autor: row[2], titulo_app: row[3], url_app: row[4],
        descripcion_app: row[5], plataforma: row[6], tipo_recurso: row[7], nivel_educativo: row[8],
        area_conocimiento: row[9], palabras_clave: row[10], licencia: row[11], eliminar_registro: row[12]
    }));

    const normalizeString = (str) => str ? str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "") : '';
    const deleteCutoff = new Map();
    allData.forEach(app => {
        if (normalizeString(app.eliminar_registro) === 'si' && app.url_app) {
            const url = app.url_app.trim();
            const ts = new Date(app.timestamp).getTime();
            const prev = deleteCutoff.get(url) ?? -Infinity;
            if (ts > prev) deleteCutoff.set(url, ts);
        }
    });

    const appsWithoutDeleted = allData.filter(app => {
        if (!app.url_app) return true;
        const cut = deleteCutoff.get(app.url_app.trim());
        if (cut === undefined) return true;
        return new Date(app.timestamp).getTime() > cut;
    });
    
    const seenUrls = new Set();
    const finalData = [];
    for (let i = appsWithoutDeleted.length - 1; i >= 0; i--) {
        const app = appsWithoutDeleted[i];
        if(!app.url_app) continue;
        const url = app.url_app.trim();
        if (!seenUrls.has(url)) {
            seenUrls.add(url);
            finalData.push(app);
        }
    }

    return {
        totalApps: finalData.length,
        plataformaData: countSingleValueItems(finalData, 'plataforma'),
        tipoRecursoData: countSingleValueItems(finalData, 'tipo_recurso'),
        licenciaData: countSingleValueItems(finalData, 'licencia'),
        areasData: countMultiValueItems(finalData, 'area_conocimiento'),
        nivelesData: countMultiValueItems(finalData, 'nivel_educativo'),
    };
};

const chartColors = ['#34d399', '#60a5fa', '#f87171', '#fbbf24', '#a78bfa', '#f472b6', '#22d3ee', '#a3e635', '#fb923c', '#9ca3af'];
const getColor = (index) => chartColors[index % chartColors.length];

export default function StatsPage() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [chartData, setChartData] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        Papa.parse(CSV_URL, {
            download: true,
            skipEmptyLines: true,
            complete: (results) => {
                try {
                    const processed = processChartData(results.data);
                    setChartData(processed);
                    setLoading(false);
                } catch (e) {
                    console.error("Error processing chart data:", e);
                    setError("No se pudieron procesar los datos para los gráficos.");
                    setLoading(false);
                }
            },
            error: (err) => {
                console.error("Error loading CSV for charts:", err);
                setError("No se pudieron cargar los datos para los gráficos.");
                setLoading(false);
            }
        });
    }, []);

    const handleChartClick = (element, chart) => {
        if (!element.length) return;
        const label = chart.data.labels[element[0].index];
        navigate(`/?search=${encodeURIComponent(label)}`);
    };

    if (loading) return <Layout><div className="text-center p-10">Cargando estadísticas...</div></Layout>;
    if (error) return <Layout><div className="text-center p-10 text-red-500">{error}</div></Layout>;

    const commonPieOptions = (chart) => ({
        onClick: (evt, element) => handleChartClick(element, chart),
        onHover: (event, chartElement) => {
            event.native.target.style.cursor = chartElement[0] ? 'pointer' : 'default';
        }
    });

    return (
        <Layout>
            <header className="text-center mb-10">
                <h1 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-white mb-2">Análisis de Aplicaciones Educativas</h1>
                <p className="text-lg text-gray-600 dark:text-gray-300">Visualización interactiva de datos del repositorio.</p>
            </header>

            <main>
                <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                    <div className="stat-card bg-white dark:bg-gray-800 p-6 rounded-xl text-center shadow-sm">
                        <h3 className="text-lg font-semibold text-gray-500 dark:text-gray-400 mb-2">Apps Activas</h3>
                        <p className="text-4xl font-bold text-emerald-500">{chartData.totalApps}</p>
                    </div>
                    <div className="stat-card bg-white dark:bg-gray-800 p-6 rounded-xl text-center shadow-sm">
                        <h3 className="text-lg font-semibold text-gray-500 dark:text-gray-400 mb-2">Total de Áreas</h3>
                        <p className="text-4xl font-bold text-emerald-500">{Object.keys(chartData.areasData).length}</p>
                    </div>
                    <div className="stat-card bg-white dark:bg-gray-800 p-6 rounded-xl text-center shadow-sm">
                        <h3 className="text-lg font-semibold text-gray-500 dark:text-gray-400 mb-2">Tipos de Licencia</h3>
                        <p className="text-4xl font-bold text-emerald-500">{Object.keys(chartData.licenciaData).length}</p>
                    </div>
                </section>

                <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="chart-container bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
                        <h2 className="text-xl font-semibold mb-4 text-center">Plataforma de creación</h2>
                        <Doughnut 
                            data={{
                                labels: Object.keys(chartData.plataformaData),
                                datasets: [{
                                    data: Object.values(chartData.plataformaData),
                                    backgroundColor: Object.keys(chartData.plataformaData).map((_, i) => getColor(i))
                                }]
                            }}
                            options={commonPieOptions}
                        />
                    </div>
                    <div className="chart-container bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
                        <h2 className="text-xl font-semibold mb-4 text-center">Tipo de recurso</h2>
                        <Doughnut 
                            data={{
                                labels: Object.keys(chartData.tipoRecursoData),
                                datasets: [{
                                    data: Object.values(chartData.tipoRecursoData),
                                    backgroundColor: Object.keys(chartData.tipoRecursoData).map((_, i) => getColor(i))
                                }]
                            }}
                            options={commonPieOptions}
                        />
                    </div>
                    <div className="chart-container bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
                        <h2 className="text-xl font-semibold mb-4 text-center">Licencia de uso</h2>
                        <Doughnut 
                            data={{
                                labels: Object.keys(chartData.licenciaData),
                                datasets: [{
                                    data: Object.values(chartData.licenciaData),
                                    backgroundColor: Object.keys(chartData.licenciaData).map((_, i) => getColor(i))
                                }]
                            }}
                            options={commonPieOptions}
                        />
                    </div>
                    <div className="chart-container lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
                        <h2 className="text-xl font-semibold mb-4 text-center">Área o áreas de conocimiento</h2>
                        <Bar 
                            data={{
                                labels: Object.keys(chartData.areasData),
                                datasets: [{
                                    label: '# de Apps',
                                    data: Object.values(chartData.areasData),
                                    backgroundColor: Object.keys(chartData.areasData).map((_, i) => getColor(i + 2))
                                }]
                            }}
                            options={{ indexAxis: 'y', ...commonPieOptions }}
                        />
                    </div>
                    <div className="chart-container lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
                        <h2 className="text-xl font-semibold mb-4 text-center">Nivel o niveles educativos</h2>
                        <Bar 
                            data={{
                                labels: Object.keys(chartData.nivelesData),
                                datasets: [{
                                    label: '# de Apps',
                                    data: Object.values(chartData.nivelesData),
                                    backgroundColor: Object.keys(chartData.nivelesData).map((_, i) => getColor(i + 2))
                                }]
                            }}
                            options={{ indexAxis: 'y', ...commonPieOptions }}
                        />
                    </div>
                </section>
            </main>
        </Layout>
    );
}
