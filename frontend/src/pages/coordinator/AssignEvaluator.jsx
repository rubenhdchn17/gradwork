import React, { useEffect, useState } from "react";
import AssignEvaluatorWireframe from "./AssignEvaluatorWireframe.jsx";

import {
    fetchEvaluadores,
    fetchProyectosSinEvaluador,
    asignarEvaluador,
} from "../../services/coordinatorService";

export default function AssignEvaluator() {
    const [proyectoSearch, setProyectoSearch] = useState("");
    const [evaluadorSearch, setEvaluadorSearch] = useState("");

    const [filteredProyectos, setFilteredProyectos] = useState([]);
    const [filteredEvaluadores, setFilteredEvaluadores] = useState([]);

    const [selectedProyecto, setSelectedProyecto] = useState(null);
    const [selectedEvaluador, setSelectedEvaluador] = useState(null);

    useEffect(() => {
        if (proyectoSearch.trim() === "") {
            setFilteredProyectos([]);
            return;
        }

        fetchProyectosSinEvaluador({ q: proyectoSearch })
            .then(setFilteredProyectos)
            .catch(() => setFilteredProyectos([]));
    }, [proyectoSearch]);

    useEffect(() => {
        if (evaluadorSearch.trim() === "") {
            setFilteredEvaluadores([]);
            return;
        }

        fetchEvaluadores({ q: evaluadorSearch })
            .then(setFilteredEvaluadores)
            .catch(() => setFilteredEvaluadores([]));
    }, [evaluadorSearch]);


    function selectProyecto(p) {
        setSelectedProyecto(p);
        setProyectoSearch(p.titulo);
        setFilteredProyectos([]);
    }

    function selectEvaluador(e) {
        setSelectedEvaluador(e);
        setEvaluadorSearch(e.nombre + " — " + e.correo);
        setFilteredEvaluadores([]);
    }

    async function handleSubmit() {
        if (!selectedProyecto || !selectedEvaluador) {
            alert("Debes seleccionar proyecto y evaluador");
            return;
        }

        try {
            await asignarEvaluador({
                proyecto_id: selectedProyecto.id,
                evaluador_id: selectedEvaluador.id,
            });

            alert("Evaluador asignado correctamente");
            setSelectedProyecto(null);
            setSelectedEvaluador(null);
            setProyectoSearch("");
            setEvaluadorSearch("");
        } catch {
            alert("Error al asignar evaluador");
        }
    }

    return (
        <AssignEvaluatorWireframe
            proyectoSearch={proyectoSearch}
            setProyectoSearch={setProyectoSearch}
            filteredProyectos={filteredProyectos}
            selectProyecto={selectProyecto}

            evaluadorSearch={evaluadorSearch}
            setEvaluadorSearch={setEvaluadorSearch}
            filteredEvaluadores={filteredEvaluadores}
            selectEvaluador={selectEvaluador}

            handleSubmit={handleSubmit}
        />
    );
}
