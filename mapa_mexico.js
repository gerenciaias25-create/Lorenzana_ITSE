// =========================================================================
// 1. INICIALIZACIÓN DEL MAPA
// =========================================================================
const map = L.map('map').setView([23.6345, -102.5528], 5);
let geojsonLayer;

L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
    maxZoom: 20
}).addTo(map);

// =========================================================================
// 2. DATASET OFICIAL INTEGRAL DE LAS TENSIONES SOCIALES (MÉXICO 2026)
// =========================================================================
const dataset = {
  "Guerrero": { itse: 96.8, nivel: "Crítica", focos: "Estado fallido de facto; control criminal total; crisis institucional extrema.", desarrollo: "Guerrero se posiciona en el nivel más alto de tensión debido a una gobernabilidad severamente fracturada y un control criminal total en amplias zonas del estado. La violencia extrema, el desplazamiento forzado y la persistencia de conflictos sociales históricos (normalistas, magisterio) generan una crisis institucional profunda. Para Morena, el impacto en 2027 es de riesgo crítico; la percepción de un Estado fallido y los escándalos en la administración local podrían capitalizarse por la oposición, generando un fuerte voto de castigo y una alta probabilidad de alternancia." },
  "Sinaloa": { itse: 94.7, nivel: "Crítica", focos: "Guerra civil interna; parálisis económica; gobernador con licencia bajo investigación.", desarrollo: "Sinaloa ha escalado a una tensión crítica debido a una guerra civil interna entre facciones de cárteles que ha provocado una parálisis económica y un clima de terror. La reciente acusación de EE.UU. contra el gobernador con licencia, Rubén Rocha Moya, ha profundizado la crisis de gobernabilidad, generando una desconfianza generalizada. Para Morena, el impacto en 2027 es crítico; la percepción de colusión o incapacidad del Estado frente al crimen organizado, sumado a los escándalos políticos, generará un rechazo masivo y un fuerte voto de castigo, poniendo en riesgo su hegemonía en el estado." },
  "Jalisco": { itse: 90.3, nivel: "Crítica", focos: "Caos por muerte de El Mencho; 65 bloqueos carreteros; CJNG en reconfiguración violenta.", desarrollo: "Jalisco experimenta una tensión crítica tras el caos generado por la muerte de \"El Mencho\" y la subsiguiente reconfiguración violenta del CJNG. Los 65 bloqueos carreteros simultáneos registrados en junio de 2026 paralizaron la logística y el transporte, evidenciando una capacidad de desestabilización sin precedentes. La crisis de personas desaparecidas y la tensión política por la sucesión estatal (2024-2027) entre Movimiento Ciudadano y Morena mantienen el clima polarizado. El impacto para Morena es crítico; la violencia generalizada y la incapacidad para garantizar la seguridad generarán un electorado volátil y un riesgo de voto de castigo significativo." },
  "Chiapas": { itse: 89.0, nivel: "Crítica", focos: "Guerra de cárteles; desplazamiento masivo; magisterio en paro indefinido.", desarrollo: "Chiapas enfrenta una tensión crítica por la guerra de cárteles que ha provocado un desplazamiento masivo de comunidades y una crisis humanitaria. El magisterio en paro indefinido y los conflictos agrarios históricos se suman a un escenario de ingobernabilidad. El impacto para Morena será crítico; la pérdida de control territorial y la incapacidad para garantizar la paz dificultan la realización de campañas y la legitimidad del proceso electoral, poniendo en riesgo la hegemonía del partido en el sureste." },
  "Michoacán": { itse: 88.3, nivel: "Crítica", focos: "Extorsión total; Tierra Caliente ingobernable; parálisis agrícola.", desarrollo: "Michoacán se mantiene en tensión crítica debido a la extorsión total que paraliza la economía agrícola en Tierra Caliente, haciendo la región prácticamente ingobernable. La presión constante del magisterio (CNTE) y la violencia criminal desbordada generan un hartazgo social profundo. El desgaste para Morena es crítico; la incapacidad para frenar la extorsión afecta directamente la economía local, lo que se traducirá en una pérdida de confianza electoral y un fuerte voto de castigo en 2027." },
  "Guanajuato": { itse: 88.0, nivel: "Crítica", focos: "Homicidios récord; huachicol; conflicto permanente con la federación.", desarrollo: "Guanajuato presenta una tensión crítica por los homicidios récord a nivel nacional, impulsados por el huachicol y el narcotráfico. El conflicto permanente entre el gobierno estatal y la federación desgasta a ambas partes y polariza el ambiente político. Para Morena, la narrativa de culpar a las autoridades locales podría agotarse, y la violencia extrema dificultará su avance electoral en 2027, enfrentando un electorado cansado de la inseguridad." },
  "México": { itse: 84.7, nivel: "Crítica", focos: "Extorsión masiva transporte; bloqueos viales permanentes; inseguridad urbana.", desarrollo: "El Estado de México se encuentra en tensión crítica debido a la extorsión masiva al sector transporte y los bloqueos viales permanentes que afectan la movilidad y la economía. La inseguridad urbana y la alta densidad de conflictos sociales en zonas metropolitanas mantienen al estado en un punto de ebullición. Siendo el padrón electoral más grande del país, el impacto para Morena es de riesgo crítico. La administración estatal morenista estará bajo escrutinio directo; si no se logran resultados rápidos contra la extorsión and la inseguridad, el voto de castigo será masivo en 2027." },
  "Chihuahua": { itse: 84.3, nivel: "Crítica", focos: "Conflicto extremo por el agua; bloqueos carreteros; violencia fronteriza.", desarrollo: "Chihuahua enfrenta una tensión crítica por el conflicto extremo por el agua y los bloqueos carreteros derivados de la Ley de Aguas y el Tratado de 1944 con EE.UU. La violencia fronteriza y en Ciudad Juárez, sumada a una fuerte pugna política, contribuyen a la inestabilidad. Para Morena, el manejo del conflicto del agua desde la federación será el factor determinante; un mal manejo consolidará el rechazo en el estado fronterizo y podría generar un voto de castigo significativo." },
  "Baja California": { itse: 83.7, nivel: "Crítica", focos: "Crisis migratoria; conflicto hídrico; violencia cárteles en Tijuana.", desarrollo: "Baja California se encuentra en tensión crítica debido a la crisis migratoria en la frontera, el conflicto hídrico en Tijuana y la violencia de cárteles que afecta la seguridad pública. La presión de EE.UU. y las amenazas arancelarias impactan la economía local. Morena enfrentará un desgaste significativo si la economía fronteriza se ve afectada y si no se logra contener la violencia, lo que podría traducirse en una pérdida de apoyo electoral en 2027." },
  "Zacatecas": { itse: 82.7, nivel: "Crítica", focos: "Violencia extrema; desplazamiento; crisis económica profunda.", desarrollo: "Zacatecas presenta una tensión crítica por la violencia extrema y el desplazamiento de comunidades enteras, lo que ha provocado una crisis económica y social profunda. El desgaste para el gobierno estatal (Morena) es severo. La percepción de abandono institucional se traducirá en una alta probabilidad de alternancia o pérdida de escaños federales en 2027, ya que el electorado buscará un cambio ante la falta de resultados en seguridad." },
  "Veracruz": { itse: 81.7, nivel: "Crítica", focos: "Inseguridad portuaria; crisis política; extorsión generalizada.", desarrollo: "Veracruz se encuentra en tensión crítica debido a la inseguridad portuaria, una crisis política persistente y la extorsión generalizada que afecta a diversos sectores. Los conflictos con el sector transporte y los escándalos institucionales desgastan a la administración estatal. Para Morena, el riesgo es crítico; el voto de castigo es probable si no se estabiliza la gobernabilidad en las regiones clave del estado, especialmente en las zonas costeras y productivas." },
  "Tamaulipas": { itse: 79.7, nivel: "Crítica", focos: "Frontera chica; violencia cárteles; inestabilidad política.", desarrollo: "Tamaulipas presenta una tensión crítica por la violencia de cárteles en la frontera chica y una inestabilidad política recurrente, exacerbada por escándalos de exgobernadores. La crisis hídrica también es un factor de conflicto. Para Morena, el impacto en 2027 es crítico; la percepción de un estado bajo el control del crimen organizado y la falta de resultados en seguridad generarán un fuerte rechazo electoral." },
  "Nuevo León": { itse: 79.3, nivel: "Crítica", focos: "Crisis hídrica extrema; parálisis legislativa; transporte colapsado.", desarrollo: "Nuevo León experimenta una tensión crítica debido a la crisis hídrica extrema en Monterrey, la parálisis legislativa por la pugna entre el Gobernador y el Congreso, y el colapso del transporte público. Aunque Morena no gobierna el estado, la polarización local y la ineficacia gubernamental en la gestión de servicios básicos podrían abrirle espacios, siempre y cuando no se le asocie con la crisis del agua a nivel federal. Sin embargo, el descontento generalizado representa un riesgo para cualquier fuerza política." },
  "Sonora": { itse: 78.9, nivel: "Crítica", focos: "Frontera fentanilo; conflicto Yaqui; violencia en el desierto.", desarrollo: "Sonora se encuentra en tensión crítica por la violencia en la frontera vinculada al tráfico de fentanilo y personas, el conflicto con la tribu Yaqui por el agua y la violencia en el desierto. La presión de Estados Unidos sobre la frontera impacta la percepción de seguridad. Morena enfrentará un electorado exigente que podría castigar la falta de contención criminal y la gestión de los conflictos sociales, lo que podría traducirse en una pérdida de apoyo en 2027." },
  "Ciudad de México": { itse: 77.7, nivel: "Crítica", focos: "Bloqueos por agua y magisterio; crisis de servicios; inseguridad.", desarrollo: "La Ciudad de México presenta una tensión crítica debido a los bloqueos por la escasez de agua y las movilizaciones del magisterio, así como las crisis en los servicios públicos (transporte, infraestructura). La inseguridad, aunque con altibajos, sigue siendo una preocupación. El impacto para Morena es de riesgo crítico; la capital es un electorado altamente crítico e informado, y las crisis de servicios públicos se traducen rápidamente en voto de castigo, como se observó en 2021. La gestión de estas tensiones será clave para mantener su base electoral." },
  "Morelos": { itse: 77.7, nivel: "Crítica", focos: "Violencia política; parálisis de poderes; inseguridad desbordada.", desarrollo: "Morelos se mantiene en tensión crítica por la violencia política, la parálisis de poderes y una inseguridad desbordada que ha generado un clima de ingobernabilidad. El impacto para Morena es crítico; el desgaste de la administración estatal saliente y la falta de resultados tangibles en seguridad provocarán un rechazo ciudadano en las urnas, con una alta probabilidad de alternancia." },
  "Quintana Roo": { itse: 74.7, nivel: "Alta", focos: "Violencia turística; conflicto transporte; impacto ambiental.", desarrollo: "Quintana Roo se encuentra en tensión alta debido a la violencia vinculada al turismo (extorsión, balaceras en zonas turísticas), el conflicto entre taxistas y plataformas como Uber, y las tensiones ambientales por megaproyectos. El impacto para Morena es de riesgo alto, ya que la afectación a la industria turística golpea directamente la economía local y la imagen del estado, lo que podría generar un voto de castigo." },
  "Oaxaca": { itse: 73.3, nivel: "Alta", focos: "Conflictos sociales crónicos; Sección 22 en paro; bloqueos agrarios.", desarrollo: "Oaxaca presenta una tensión alta por los conflictos sociales crónicos del magisterio (Sección 22 en paro) y los bloqueos agrarios que afectan la gobernabilidad. Aunque la violencia criminal es menor que en otros estados, la movilización social constante desgasta la autoridad. Morena, que gobierna el estado, deberá gestionar estas crisis mediante concesiones para evitar un impacto negativo en 2027, ya que la inestabilidad social puede traducirse en descontento electoral." },
  "Puebla": { itse: 70.3, nivel: "Alta", focos: "Huachicol; linchamientos; movilizaciones sociales.", desarrollo: "Puebla se encuentra en tensión alta debido al huachicol, los linchamientos en zonas rurales y las movilizaciones sociales que generan inestabilidad. La inseguridad en la zona metropolitana también es un factor. El impacto para Morena es de riesgo alto, requiriendo una gestión de crisis efectiva para evitar que la oposición recupere terreno y capitalice el descontento social." },
  "Tabasco": { itse: 69.0, nivel: "Alta", focos: "Inseguridad creciente; protestas infraestructura.", desarrollo: "Tabasco presenta una tensión alta por la inseguridad creciente y las protestas vinculadas a proyectos de infraestructura que han elevado el descontento. El impacto para Morena es alto; la pérdida de la \"inmunidad política\" post-AMLO hará que el electorado juzgue estrictamente los resultados en seguridad y desarrollo, lo que podría generar un voto de castigo." },
  "Colima": { itse: 68.9, nivel: "Alta", focos: "Máxima violencia per cápita; baja conflictividad social organizada.", desarrollo: "Colima, a pesar de su tamaño, mantiene la máxima violencia per cápita del país debido a la disputa por el control del puerto de Manzanillo. Aunque la conflictividad social organizada es relativamente baja, la violencia extrema por sí misma genera una tensión alta. El impacto para Morena es alto; la incapacidad para pacificar el estado generará un fuerte rechazo electoral y una alta probabilidad de alternancia." },
  "San Luis Potosí": { itse: 58.3, nivel: "Media", focos: "Bloqueos carreteros; inseguridad regional.", desarrollo: "San Luis Potosí presenta una tensión media debido a los bloqueos carreteros y la inseguridad regional que afectan la movilidad y el comercio. El impacto para Morena es moderado; la competencia será cerrada y dependerá de las alianzas locales y la capacidad de gestión de la seguridad." },
  "Hidalgo": { itse: 49.7, nivel: "Media", focos: "Huachicol; tensiones ejidales.", desarrollo: "Hidalgo se encuentra en tensión media por el huachicol y las tensiones ejidales que generan conflictos localizados. El impacto es moderado; Morena mantiene control, pero debe evitar que la violencia escale y que los conflictos sociales se generalicen." },
  "Campeche": { itse: 47.0, nivel: "Media", focos: "Inseguridad en aumento; sector petrolero.", desarrollo: "Campeche presenta una tensión media por la inseguridad in aumento y los conflictos en el sector petrolero que afectan la economía local. El impacto es moderado, con una competencia electoral que se prevé cerrada y donde la gestión de la seguridad y los recursos naturales será clave." },
  "Nayarit": { itse: 38.7, nivel: "Baja", focos: "Seguridad regional; conflictos menores.", desarrollo: "Nayarit se encuentra en tensión baja con seguridad regional y conflictos menores. El impacto para Morena es bajo; la estabilidad beneficia al partido gobernante, manteniendo una ventaja por la relativa calma." },
  "Durango": { itse: 37.0, nivel: "Baja", focos: "Mejora en paz; conflictos mineros.", desarrollo: "Durango presenta una tensión baja con una mejora en los indicadores de paz y conflictos mineros localizados. El impacto para Morena es bajo; la estabilidad beneficia al partido gobernante local, dificultando el avance de Morena." },
  "Baja California Sur": { itse: 35.7, nivel: "Baja", focos: "Conflictos turísticos; agua.", desarrollo: "Baja California Sur se encuentra en tensión baja debido a conflictos turísticos y por el acceso al agua. El impacto para Morena es bajo; la estabilidad económica y la percepción de seguridad favorecen al partido en el poder." },
  "Tlaxcala": { itse: 33.3, nivel: "Baja", focos: "Trata de personas; baja tensión social.", desarrollo: "Tlaxcala presenta una tensión baja con el problema histórico de la trata de personas y conflictos municipales menores. El impacto electoral a nivel federal es bajo, y Morena mantiene control." },
  "Coahuila": { itse: 28.3, nivel: "Baja", focos: "Líder en seguridad; estabilidad política.", desarrollo: "Coahuila se posiciona en tensión baja como líder en seguridad y con estabilidad política. El impacto para Morena es bajo; el PRI mantiene un fuerte control territorial, siendo un reto para Morena penetrar en este bastión." },
  "Querétaro": { itse: 25.3, nivel: "Baja", focos: "Crecimiento; tensiones servicios.", desarrollo: "Querétaro presenta una tensión baja con tensiones por el crecimiento urbano acelerado y los servicios públicos (agua). El impacto es bajo; siendo un bastión panista, Morena tiene un avance limitado." },
  "Aguascalientes": { itse: 20.3, nivel: "Baja", focos: "Estabilidad; bajo riesgo.", desarrollo: "Aguascalientes se encuentra en tensión baja con estabilidad relativa y bajo riesgo. El impacto para Morena es bajo; es un bastión panista donde Morena enfrenta un desafío considerable." },
  "Yucatán": { itse: 11.7, nivel: "Baja", focos: "Excepción nacional de paz; gobernabilidad plena.", desarrollo: "Yucatán se mantiene como la excepción nacional de paz, con gobernabilidad plena y conflictos sociales mínimos. Esta estabilidad excepcional lo posiciona como un estado de bajo impacto para Morena, donde la competencia se centrará en mantener las condiciones actuales y la percepción de seguridad. Los números reflejan una brecha significativa con el resto del país, confirmando su estatus de baja tensión y consolidando su posición como el estado más pacífico de México." }
};

// =========================================================================
// 3. NORMALIZACIÓN ORTOGRÁFICA PARA GEOJSON
// =========================================================================
function normalizarTexto(texto) {
    if (!texto) return "";
    return texto.toString().toLowerCase()
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
                .replace(/[^a-z0-9]/g, "")
                .trim();
}

function obtenerLlaveDataset(nombreGeoJSON) {
    if (!nombreGeoJSON) return null;
    const geoNorm = normalizarTexto(nombreGeoJSON);
    return Object.keys(dataset).find(key => normalizarTexto(key) === geoNorm) || null;
}

// =========================================================================
// 4. ESCALA OFICIAL DE COLORES SEGÚN RANGOS DEL ESTUDIO
// =========================================================================
function getColor(value) {
    if (value >= 75) return '#d9534f'; // Crítica (75-100)
    if (value >= 60) return '#f0ad4e'; // Alta (60-74)
    if (value >= 40) return '#4e59f0'; // Media (40-59)
    return '#5cb85c';                  // Baja (0-39)
}

function style(feature) {
    const estadoNombre = feature.properties.NOM_ENT || feature.properties.name || "";
    const llave = obtenerLlaveDataset(estadoNombre);
    const valor = (llave && dataset[llave]) ? dataset[llave].itse : 0;

    return {
        fillColor: getColor(valor),
        weight: 1.5,
        opacity: 1,
        color: 'rgba(255,255,255,0.12)',
        fillOpacity: 0.75
    };
}

function onEachFeature(feature, layer) {
    const estadoNombreGeo = feature.properties.NOM_ENT || feature.properties.name || "";
    const llave = obtenerLlaveDataset(estadoNombreGeo);
    
    if (llave && dataset[llave]) {
        const data = dataset[llave];
        
        // Tooltip nativo flotante
        layer.bindTooltip(`<b>${llave}</b><br>ITSE: ${data.itse} (${data.nivel})`, {
            className: 'leaflet-tooltip-custom',
            sticky: true
        });
        
        // Al hacer click, abre su sección correspondiente en el acordeón Diagnóstico
        layer.on('click', () => {
            switchTab('mapa');
            abrirAcordeonEstado(llave);
        });
    }
}

// Inyección de capas geográficas (Usa mexicoGeoJSON global si está cargado o fetch alterno)
if (typeof mexicoGeoJSON !== 'undefined') {
    geojsonLayer = L.geoJson(mexicoGeoJSON, { style: style, onEachFeature: onEachFeature }).addTo(map);
} else {
    fetch('https://raw.githubusercontent.com/angelnm98/vector-mexico/master/estados.json')
        .then(res => res.json())
        .then(data => {
            geojsonLayer = L.geoJson(data, { style: style, onEachFeature: onEachFeature }).addTo(map);
        });
}

// =========================================================================
// 5. GENERACIÓN DINÁMICA DEL ACORDEÓN DE DIAGNÓSTICOS (32 ESTADOS)
// =========================================================================
function generarAcordeonDiagnostico() {
    const contenedor = document.getElementById("lista-diagnostico-acordeon");
    if (!contenedor) return;
    contenedor.innerHTML = "";

    // Ordenados por nivel crítico y puntuación descendente
    Object.entries(dataset)
      .sort((a, b) => b[1].itse - a[1].itse)
      .forEach(([nombreEstado, datos]) => {
        const item = document.createElement("div");
        item.className = "acordeon-item";
        item.setAttribute("data-estado", nombreEstado);

        let badgeClass = "badge-diag-media";
        if (datos.nivel === "Crítica") badgeClass = "badge-diag-critica";
        if (datos.nivel === "Alta") badgeClass = "badge-diag-alta";
        if (datos.nivel === "Baja") badgeClass = "badge-diag-baja";

        item.innerHTML = `
            <button class="acordeon-header" onclick="toggleAcordeon(this)">
                <div class="acordeon-header-left">
                    <span class="badge-nivel-diag ${badgeClass}">${datos.nivel}</span>
                    <span style="font-weight:500;">${nombreEstado}</span>
                </div>
                <div style="display:flex; gap:10px; align-items:center;">
                   <span style="font-size:0.75rem; color:var(--text2);">ITSE: <b>${datos.itse}</b></span>
                   <span class="flecha">▼</span>
                </div>
            </button>
            <div class="acordeon-body">
                <div class="contenido-diagnostico">
                    <div class="bloque-data-diag">
                        <strong>Focos de Tensión</strong>
                        <p style="color: #ffcbd1; font-weight: 500; margin:0;">${datos.focos}</p>
                    </div>
                    <div class="bloque-data-diag">
                        <strong>Desarrollo Analítico y Proyección Electoral 2027</strong>
                        <p style="margin:0; text-align:justify;">${datos.desarrollo}</p>
                    </div>
                </div>
            </div>
        `;
        contenedor.appendChild(item);
    });
}

function toggleAcordeon(elemento) {
    const cuerpo = elemento.nextElementSibling;
    const estaActivo = elemento.classList.contains("active");
    
    document.querySelectorAll(".acordeon-header").forEach(h => {
        h.classList.remove("active");
        h.nextElementSibling.style.maxHeight = null;
    });

    if (!estaActivo) {
        elemento.classList.add("active");
        cuerpo.style.maxHeight = cuerpo.scrollHeight + "px";
    }
}

function abrirAcordeonEstado(nombreEstado) {
    const item = document.querySelector(`.acordeon-item[data-estado="${nombreEstado}"]`);
    if (item) {
        const header = item.querySelector(".acordeon-header");
        toggleAcordeon(header);
        setTimeout(() => {
            item.scrollIntoView({ behavior: "smooth", block: "nearest" });
        }, 150);
    }
}

// =========================================================================
// 6. RENDERIZADO DE MATRIZ GENERAL, RANKING Y SEMÁFOROS (PROCESAMIENTO)
// =========================================================================
function inicializarPanelesMetricos() {
    let criticos = [], altos = [], medias = [], bajas = [];
    let countC = 0, countA = 0, countM = 0, countB = 0;
    
    const tbody = document.getElementById("tabla-body");
    const rankingContainer = document.getElementById("ranking-container");
    
    if(tbody) tbody.innerHTML = "";
    if(rankingContainer) rankingContainer.innerHTML = "";

    // Ordenar de mayor a menor ITSE para el ranking y tabla
    const estadosOrdenados = Object.entries(dataset).sort((a,b) => b[1].itse - a[1].itse);

    estadosOrdenados.forEach(([estado, datos], index) => {
        const valor = datos.itse;
        const colorItem = getColor(valor);
        
        // 1. Clasificación en Listas de Semáforos y contadores
        if (valor >= 75) { criticos.push(`${estado} (${valor})`); countC++; }
        else if (valor >= 60) { altos.push(`${estado} (${valor})`); countA++; }
        else if (valor >= 40) { medias.push(`${estado} (${valor})`); countM++; }
        else { bajas.push(`${estado} (${valor})`); countB++; }

        // 2. Inyección en Matriz General (Tabla)
        if(tbody) {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td style="font-weight:bold;">${estado}</td>
                <td style="color:${colorItem}; font-weight:bold;">${valor}</td>
                <td>${datos.nivel}</td>
                <td style="font-size:0.75rem; color:var(--text2);">${datos.focos}</td>
            `;
            tbody.appendChild(tr);
        }

        // 3. Inyección en Ranking
        if(rankingContainer) {
            const rItem = document.createElement("div");
            rItem.className = "ranking-item";
            rItem.innerHTML = `
                <div style="display:flex; gap:10px; align-items:center;">
                    <span style="color:var(--text2); font-size:0.75rem; width:20px;">#${index+1}</span>
                    <span style="font-weight:500;">${estado}</span>
                </div>
                <span style="background:${colorItem}; color:#000; padding:2px 6px; border-radius:3px; font-weight:bold; font-size:0.75rem;">${valor}</span>
            `;
            rankingContainer.appendChild(rItem);
        }
    });

    // Actualizar Cuadro de Alertas Flotante del Mapa
    if(document.getElementById('count-critica')) document.getElementById('count-critica').innerText = countC;
    if(document.getElementById('count-alta')) document.getElementById('count-alta').innerText = countA;
    if(document.getElementById('count-media')) document.getElementById('count-media').innerText = countM;
    if(document.getElementById('count-baja')) document.getElementById('count-baja').innerText = countB;

    // Actualizar Textos del Semáforo
    if(document.getElementById('lista-critico')) document.getElementById('lista-critico').innerText = criticos.join(', ') || 'Ninguno';
    if(document.getElementById('lista-alto')) document.getElementById('lista-alto').innerText = altos.join(', ') || 'Ninguno';
    if(document.getElementById('lista-acumulativo')) document.getElementById('lista-acumulativo').innerText = medias.join(', ') || 'Ninguno';
    if(document.getElementById('lista-estabilidad')) document.getElementById('lista-estabilidad').innerText = bajas.join(', ') || 'Ninguno';
}

// Inicialización general automatizada
document.addEventListener("DOMContentLoaded", () => {
    generarAcordeonDiagnostico();
    inicializarPanelesMetricos();
});