import Layout from '../components/Layout';

export default function VisitsPage() {
  return (
    <Layout>
      <div className="w-full h-[80vh]">
        <iframe 
          src="https://bilateria.org/vce/stats/stats.html" 
          className="w-full h-full border-0"
          title="Panel de Estadísticas de Visitas">
        </iframe>
      </div>
    </Layout>
  );
}
