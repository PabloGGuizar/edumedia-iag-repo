export default function HelpModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50" onClick={onClose}>
      <div className="bg-surface rounded-lg shadow-xl max-w-2xl w-full h-[85vh] flex flex-col " onClick={(e) => e.stopPropagation()}>
        <div className="flex-shrink-0 p-3 border-b flex justify-end items-center relative ">
          <h3 className="text-xl font-bold text-primary absolute left-1/2 -translate-x-1/2">Ayuda</h3>
          <button onClick={onClose} className="text-muted hover:text-slate-800  dark:hover:text-white text-3xl font-bold p-1 leading-none">&times;</button>
        </div>
        <div className="overflow-auto p-6">
            <h3>Guía de uso del repositorio</h3>

            <h4>1. Encontrar el recurso perfecto</h4>
            <ul>
                <li><strong>La búsqueda principal:</strong> Es la barra de búsqueda grande que ves al principio. Puedes escribir cualquier término (el nombre de un autor, una palabra del título, un concepto como “gamificación”, etc.) y el buscador buscará en todos los campos de todas las tarjetas.</li>
                <li><strong>Filtrado detallado:</strong> Para búsquedas más precisas, el panel de filtros es tu mejor aliado.
                <ul>
                    <li>Haz clic en el botón <em>Filtros</em> para mostrarlo u ocultarlo.</li>
                    <li>Dentro, encontrarás categorías como <em>Área de Conocimiento</em>, <em>Nivel Educativo</em> o <em>Tipo de Recurso</em>.</li>
                    <li>Haz clic en los botones de cada categoría para aplicar los filtros. En algunas categorías puedes seleccionar varias opciones a la vez (por ejemplo, Primaria y Secundaria).</li>
                    <li>Usa el botón <em>“Limpiar Filtros”</em> para eliminar la selección de este panel sin afectar a la búsqueda principal.</li>
                </ul>
                </li>
                <li><strong>Filtros rápidos desde las tarjetas:</strong> Dentro de cada tarjeta de recurso, verás que el nombre del autor, el nivel, el área y las palabras clave son enlaces. Si haces clic en uno de ellos, se aplicará ese filtro automáticamente.</li>
            </ul>

            <h4>2. Gestionar tus preferencias y búsquedas</h4>
            <ul>
                <li><strong>Guardar tus favoritos:</strong>
                <ul>
                    <li>Haz clic en el icono del corazón (♡) en la esquina superior derecha de la tarjeta. Se volverá rojo (♥) y se guardará en tus favoritos.</li>
                    <li>Los favoritos se guardan localmente en tu navegador.</li>
                    <li>Para ver solo tus recursos favoritos, pulsa el botón <em>Favoritos</em> (con el icono del corazón) al lado de la barra de búsqueda. Vuelve a pulsarlo para ver todos los recursos.</li>
                </ul>
                </li>
                <li><strong>Compartir tus búsquedas:</strong>
                <ul>
                    <li>Una vez aplicados los filtros, pulsa el botón <em>“Compartir URL”</em>. Se copiará un enlace único al portapapeles con tu selección de filtros.</li>
                </ul>
                </li>
                <li><strong>Limpiar todo:</strong>
                <ul>
                    <li>El botón <em>“Limpiar todo”</em> restablece la página: borra la búsqueda, desactiva filtros y muestra todos los recursos.</li>
                </ul>
                </li>
            </ul>

            <h4>3. Entendiendo una tarjeta de recurso</h4>
            <ul>
                <li><strong>Borde de color:</strong> Indica la plataforma principal con la que se ha creado el recurso (por ejemplo, morado para Gemini, naranja para Claude, etc.).</li>
                <li><strong>Título y autor:</strong> El nombre del recurso y quién la ha creado.</li>
                <li><strong>Nivel y área:</strong> Campos educativos a los que se dirige. Son filtros rápidos.</li>
                <li><strong>Palabras clave:</strong> Etiquetas que describen el recurso. También son filtros rápidos.</li>
                <li><strong>Visitar aplicación:</strong> Botón principal para abrir el recurso en otra pestaña.</li>
            </ul>

            <h4>4. ¿Quieres añadir tu propio recurso?</h4>
            <p>Este es un proyecto colaborativo. Si has creado un recurso y quieres que aparezca aquí, solo tienes que unirte al grupo de Telegram <a href="#" target="_blank" rel="noreferrer">EduMedia-IAG</a> y seguir las instrucciones del mensaje fijado para rellenar el formulario.</p>
            
            <h4>5. Modificar o eliminar un recurso</h4>
            <p>Los autores pueden modificar o eliminar sus entradas en cualquier momento. Para ello, deben rellenar de nuevo el formulario de alta de recursos.</p>
            <ul>
                <li><strong>Para modificar un recurso:</strong> es necesario completar todos los campos del formulario de nuevo. El sistema identifica los recursos por su URL, por lo que la entrada más reciente con una URL determinada reemplazará a la anterior. Si lo que quieres es cambiar la URL de tu recurso, deberás asegurarte de que el <strong>título del recurso</strong> sea exactamente el mismo que en la entrada original para que el sistema pueda encontrarla y reemplazarla correctamente.</li>
                <li><strong>Para eliminar un recurso:</strong> bastará con que rellenes el campo de la URL que usaste para dar de alta el recurso y marques la casilla de eliminación. El resto de campos no tienen importancia.</li>
            </ul>

            <h4>6. Principios de uso y responsabilidad</h4>
            <p>El uso de estas herramientas debe realizarse siempre de forma responsable y en consonancia con los principios éticos y de uso adecuado de las tecnologías digitales en el ámbito educativo.</p>

            <div className="p-4 bg-yellow-50 border-l-4 border-yellow-400 text-yellow-800 mt-8">
                <p className="font-bold">Aviso importante</p>
                <p>Algunos de los recursos de este repositorio integran Inteligencia Artificial. Por este motivo, su utilización por parte de menores de edad debe estar siempre acompañada y supervisada por un adulto (docente o tutor legal) que pueda guiarles y asegurar un uso correcto y seguro.</p>
            </div>

            <p className="text-center mt-8 text-muted">
                ¡Esperamos que encuentres herramientas útiles para tus clases!
            </p>
        </div>
      </div>
    </div>
  );
}
