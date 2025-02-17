import { useState, useEffect } from "react";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import Papa from "papaparse";
import "../CSS/Informes.css";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
} from 'chart.js';
import { Bar, Pie } from "react-chartjs-2";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
);

interface Champion {
    id: number;
    apiname: string;
    title: string;
    difficulty: number;
    herotype: string;
    damage: number;
}

const Informes: React.FC = () => {
    const [champions, setChampions] = useState<Champion[]>([]);
    const [filteredChampions, setFilteredChampions] = useState<Champion[]>([]);

    // Estados temporales para los filtros
    const [selectedDifficulty, setSelectedDifficulty] = useState<number | "">("");
    const [selectedHeroType, setSelectedHeroType] = useState<string>("");

    // Estados aplicados a la tabla
    const [appliedDifficulty, setAppliedDifficulty] = useState<number | "">("");
    const [appliedHeroType, setAppliedHeroType] = useState<string>("");

    useEffect(() => {
        const fetchData = async () => {
            const response = await fetch("../Data/LoL_champion_data.csv");
            const text = await response.text();
            const { data } = Papa.parse<Champion>(text, { header: true });

            const parsedData = data.map((champ: any) => ({
                id: parseFloat(champ.id),
                apiname: champ.apiname,
                title: champ.title,
                difficulty: parseFloat(champ.difficulty),
                herotype: champ.herotype,
                damage: parseFloat(champ.damage),
            }));

            setChampions(parsedData);
            setFilteredChampions(parsedData);
        };

        fetchData();
    }, []);

    const applyFilters = () => {
        setAppliedDifficulty(selectedDifficulty);
        setAppliedHeroType(selectedHeroType);

        const filtered = champions.filter((champ) => {
            return (
                (selectedDifficulty === "" || champ.difficulty === selectedDifficulty) &&
                (selectedHeroType === "" || champ.herotype === selectedHeroType)
            );
        });

        setFilteredChampions(filtered);
    };

    const generatePDF = () => {
        const doc = new jsPDF();

        // Título del PDF
        doc.setFontSize(18);
        doc.text("Informe de Campeones", 14, 16);

        // Función para traducir los tipos
        const translateHeroType = (type: string) => {
            switch (type) {
                case "Mage": return "Mago";
                case "Fighter": return "Luchador";
                case "Tank": return "Tanque";
                default: return type;
            }
        };

        // Datos para la tabla con los tipos traducidos
        const tableData = filteredChampions.map((champ) => [
            champ.apiname,
            champ.title,
            champ.difficulty,
            translateHeroType(champ.herotype),
            isNaN(champ.damage) ? "NaN" : champ.damage,
        ]);

        // Encabezados de la tabla
        const headers = ["Nombre", "Título", "Dificultad", "Tipo", "Daño"];

        // Crear la tabla
        doc.autoTable({
            head: [headers],
            body: tableData,
            startY: 20,
            theme: "striped",
            styles: {
                fontSize: 12,
                cellPadding: 3,
                halign: "center",
                minCellHeight: 10,
                lineColor: [44, 62, 80],
                lineWidth: 0.25,
            },
            headStyles: {
                fillColor: "#16b101",
                textColor: "#ffffff",
                fontStyle: "bold",
            },
            alternateRowStyles: {
                fillColor: [220, 220, 220],
            },
            margin: { top: 30 },
        });

        // Obtener la posición Y donde termina la tabla
        let finalY = doc.autoTable.previous.finalY;
        const pageHeight = doc.internal.pageSize.height;

        // Calcular el total de campeones
        const totalChampions = filteredChampions.length;

        // Verificar si hay espacio suficiente en la página actual
        if (finalY + 20 > pageHeight) {
            doc.addPage();
            finalY = 20; // Reiniciar la posición Y en la nueva página
        }

        // Añadir el total de campeones
        doc.setFontSize(12);
        doc.text(`Total de campeones: ${totalChampions}`, 14, finalY + 10);

        // Calcular posición para el resumen
        let summaryY = finalY + 25;

        // Verificar si hay espacio para el resumen
        if (summaryY + 30 > pageHeight) {
            doc.addPage();
            summaryY = 20; // Reiniciar la posición en la nueva página
        }

        // Estilo del encabezado del resumen
        doc.setFontSize(14);
        doc.setTextColor(22, 177, 1);
        doc.text("Resumen del Informe", 14, summaryY);

        // Estilo del texto del resumen
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        const summaryText = `Este informe contiene ${totalChampions} campeones de tipo "${translateHeroType(appliedHeroType)}" con dificultad "${appliedDifficulty}"`;

        // Añadir un fondo para el resumen
        const pageWidth = doc.internal.pageSize.getWidth();
        const margin = 10;
        doc.setFillColor(255, 255, 255);
        doc.rect(margin, summaryY + 5, pageWidth - margin * 2, 30, 'F');

        // Añadir el texto del resumen
        doc.text(summaryText, 14, summaryY + 10);

        // Añadir número de página
        const pageCount = doc.internal.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            doc.setFontSize(10);
            doc.text(`Página ${i} de ${pageCount}`, 14, doc.internal.pageSize.height - 10);
        }

        // Guardar el PDF
        doc.save("Informe_Campeones.pdf");
    };

    const getChartData = () => {
        const rolesCount = champions.reduce((acc, champ) => {
            acc[champ.herotype] = (acc[champ.herotype] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        return {
            labels: Object.keys(rolesCount),
            datasets: [
                {
                    label: 'Cantidad de Campeones por Tipo',
                    data: Object.values(rolesCount),
                    backgroundColor: ['rgba(75, 192, 192, 0.6)', 'rgba(255, 99, 132, 0.6)', 'rgba(255, 206, 86, 0.6)', 'rgba(207, 86, 255, 0.6)', 'rgba(86, 255, 86, 0.6)', 'rgba(255, 134, 86, 0.6)', 'rgba(0, 0, 0, 0.6)'],
                },
            ],
        };
    };

    const getPieChartData = () => {
        const difficultyCount = champions.reduce((acc, champ) => {
            acc[champ.difficulty] = (acc[champ.difficulty] || 0) + 1;
            return acc;
        }, {} as Record<number, number>);

        return {
            labels: Object.keys(difficultyCount).map(d => `Dificultad ${d}`),
            datasets: [
                {
                    label: 'Cantidad de Campeones por Dificultad',
                    data: Object.values(difficultyCount),
                    backgroundColor: ['rgba(75, 192, 192, 0.6)', 'rgba(255, 99, 132, 0.6)', 'rgba(255, 206, 86, 0.6)', 'rgba(255, 134, 86, 0.6)'],
                },
            ],
        };
    };

    return (
        <div className="fondo">
            <div className="container">
                <h1 className="title">Generar Informe de Campeones</h1>

                {/* Filtros con botón */}
                <div className="filters">
                    <select
                        className="select"
                        value={selectedDifficulty}
                        onChange={(e) => setSelectedDifficulty(e.target.value ? Number(e.target.value) : "")}
                    >
                        <option value="">Seleccionar Dificultad</option>
                        <option value="1">Fácil</option>
                        <option value="2">Media</option>
                        <option value="3">Difícil</option>
                    </select>

                    <select
                        className="select"
                        value={selectedHeroType}
                        onChange={(e) => setSelectedHeroType(e.target.value)}
                    >
                        <option value="">Seleccionar Tipo</option>
                        <option value="Mage">Mago</option>
                        <option value="Fighter">Luchador</option>
                        <option value="Tank">Tanque</option>
                    </select>

                    <button onClick={applyFilters} className="filterButton">
                        Aplicar Filtros
                    </button>
                </div>


                <button onClick={generatePDF} className="printButton">
                    Imprimir PDF
                </button>

                {/* Gráficas generales (NO filtradas) */}
                <div className="chart-container">
                    <h2>Gráfica de Tipos</h2>
                    <Bar data={getChartData()} />
                </div>

                <div className="chart-container">
                    <h2>Gráfica de Dificultad</h2>
                    <Pie data={getPieChartData()} />
                </div>
            </div>
        </div>

    );
};

export default Informes;
