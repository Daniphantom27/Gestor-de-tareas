import { React } from 'react';
import Navbar from './elementos/Navbar';
import Recursos from './elementos/Recursos';
import Modal from './elementos/Modal';
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function Tareas() {

	const [session] = useState(JSON.parse(localStorage.getItem("session")));

	const [recursos, setRecursos] = useState([]);
	const [tareas, setTareas] = useState([]);

	const [estadoModalCrear, setEstadoModalCrear] = useState(false);
	const [estadoModalActualizar, setEstadoModalActualizar] = useState(false);

	const initialTarea = { "id_tarea": "", "usuario_id_usuario": session.id, "desc_tarea": "", "fecha_tarea": "", "estado_tarea": 0, "id_recurso": 0, "desc_recurso": "" };

	const [tarea, setTarea] = useState(initialTarea);
	const [tareaEditar, setTareaEditar] = useState({});


	useEffect(() => {
		axios.get('http://consultas.cuc.edu.co/api/v1.0/recursos', {
			headers: {
				'Authorization': 'JWT eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjo0LCJ1c2VybmFtZSI6InBydWViYTIwMjJAY3VjLmVkdS5jbyIsImV4cCI6MTY0OTQ1MzA1NCwiY29ycmVvIjoicHJ1ZWJhMjAyMkBjdWMuZWR1LmNvIn0.MAoFJE2SBgHvp9BS9fyBmb2gZzD0BHGPiyKoAo_uYAQ'
			}
		})
			.then((respuesta) => {
				setRecursos(respuesta.data)
			}).catch((error) => {
				console.log(error.message)
			});

		//Todas las tareas
		buscarTareas();
	}, [])


	/** Modales **/
	const abrirModalCrear = () => {
		setTarea(initialTarea);
		setEstadoModalCrear(!estadoModalCrear);
	}

	const abrirModalActualizar = (id) => {
		const tarea = tareas.filter(tarea => id == tarea.id_tarea)[0];
		setTareaEditar(tarea);
		setEstadoModalActualizar(!estadoModalActualizar);
	}

	/** Acciones **/
	//Buscar tareas
	const buscarTareas = () => {
		axios.get('http://localhost:8080/api/tareas')
			.then((respuesta) => {
				console.log(respuesta.data);
				const tareasUsu = [];
				(respuesta.data).map(tarea => {
					if (tarea.usuario_id_usuario === session.id) {
						tareasUsu.push(tarea);
					}
				});
				setTareas(tareasUsu);
			}).catch((error) => {
				console.log(error.message)
			});
	}


	//Crear tarea
	const crearTarea = (ev) => {
		ev.preventDefault();
		if (tarea.desc_tarea.trim() == "" || tarea.fecha_tarea == "" || tarea.desc_recurso == "") {
			alert("Rellene todos los campos")
			return
		}
		axios.post('http://localhost:8080/api/tareas', tarea)
			.then((respuesta) => {
				console.log(respuesta.data)
				buscarTareas();
			}).catch((error) => {
				console.log(error.message)
			});
		setEstadoModalCrear(!estadoModalCrear);
	}


	// Actualizar tarea
	const actualizarTarea = (ev) => {
		ev.preventDefault();
		if (tareaEditar.desc_tarea.trim() == "" || tareaEditar.fecha_tarea == "" || tareaEditar.id_recurso == "0") {
			alert("Rellene todos los campos")
			return
		}
		axios.put('http://localhost:8080/api/tareas/' + tareaEditar.id_tarea, tareaEditar)
			.then((respuesta) => {
				console.log(respuesta.data)
				buscarTareas();
			}).catch((error) => {
				console.log(error.message)
			});
		setEstadoModalActualizar(!estadoModalActualizar);
	}

	//Eliminar tarea
	const deleteTarea = (id) => {
		axios.delete('http://localhost:8080/api/tareas/' + id)
			.then((respuesta) => {
				console.log(respuesta.data)
				buscarTareas();
			})
			.catch((error) => {
				console.log(error.message)
			});
	}


	return (
		<>
			<Navbar />
			<main id="main">
				<section id="contact" className="contact mt-3">
					<div className="container">
						<div className="section-title">
							<h2>Tareas por realizar</h2>
						</div>
						<div className="row">
							{/* LISTA DE TAREAS */}
							<div className="col-lg-9 mt-5 mt-lg-0 align-items-stretch">
								<div className="icon-box" style={{ borderTop: '3px solid #16df7e', borderBottom: '3px solid #16df7e', padding: '20px', backgroundColor: '#f9f9fa' }}>
									<h4>Gestor de tareas <i className="bi bi-arrow-repeat"></i></h4>
									<table className="table table-hover">
										<thead>
											<tr>
												<th scope="col">Descripción</th>
												<th scope="col">Fecha</th>
												<th scope="col">Recurso</th>
												<th scope="col">Estado</th>
												<th scope="col">Opciones</th>
											</tr>
										</thead>
										<tbody>
											{
												tareas.map(tarea => {
													return (
														<tr key={tarea.id_tarea}>
															<td>{tarea.desc_tarea}</td>
															<td>{tarea.fecha_tarea}</td>
															<td>{tarea.desc_recurso}</td>
															<td>{tarea.estado_tarea == 0 ? "No finalizado" : "Finalizado"}</td>
															<td>
																<button type="button" className="btn btn-primary btn-circle" onClick={() => (abrirModalActualizar(tarea.id_tarea))}><i className="bi bi-pencil-square"></i></button>
																<button type="button" className="btn btn-danger btn-circle" onClick={() => (deleteTarea(tarea.id_tarea))}><i className="bi bi-trash-fill"></i></button>
															</td>
														</tr>
													)
												})
											}
										</tbody>
									</table>
									<div className="text-center mt-3">
										<button className="btn-tarea" onClick={() => abrirModalCrear()}>Nueva tarea <i className="bi bi-plus-lg"></i></button>
									</div>
								</div>
							</div>

							<Recursos />

							{/* MODAL CREAR*/}
							<Modal titulo='Crear nueva tarea' estadoModal={estadoModalCrear} setEstadoModal={setEstadoModalCrear}>
								<div className="contenido-children">
									<div className="container">
										<div className="col-lg-12 col-md-12 py-3">
											<form onSubmit={(ev) => crearTarea(ev)}>
												<div className="contact">
													<div className="row">
														<div className="form-group col-md-7">
															<label>Descripción</label>
															<input value={tarea.desc_tarea} type="text" name="tarea-desc" className="form-control" id="tarea-desc" onChange={(ev) => setTarea({ ...tarea, "desc_tarea": ev.target.value })} />
														</div>
														<div className="form-group col-md-5" >
															<label>Recurso</label>
															<select name="tarea-rec" id="tarea-rec" className="form-select" onChange={(ev) => setTarea({ ...tarea, "desc_recurso": ev.target.options[ev.target.selectedIndex].innerText, "id_recurso": ev.target.value })}>
																<option value="0">Seleccione</option>
																{
																	recursos.map(recurso => {
																		return (<option key={recurso.id} value={recurso.id}>{recurso.nombre}</option>)
																	})
																}
															</select>
														</div>
													</div>
													<br />
													<div className="row">
														<div className="form-group col-md-7">
															<label>Fecha</label>
															<input type="date" name="tarea-fecha" className="form-control" id="tarea-fecha" onChange={(ev) => setTarea({ ...tarea, "fecha_tarea": ev.target.value })} />
														</div>
														<div className="form-group col-md-5">
															<label>Estado</label>
															<select name="tarea-estado" id="tarea-estado" className="form-select" disabled>
																<option value="0">No finalizado</option>
																<option value="1">Finalizado</option>
															</select>
														</div>
													</div>
													<div className="text-center mt-4"><button className="btn-tarea">Guardar</button></div>
												</div>
											</form>
										</div>
									</div>
								</div>
							</Modal>

							{/* MODAL ACTUALIZAR*/}
							<Modal titulo={`Actualizar tarea ${tareaEditar.id_tarea}`} estadoModal={estadoModalActualizar} setEstadoModal={setEstadoModalActualizar}>
								<div className="contenido-children">
									<div className="container">
										<div className="col-lg-12 col-md-12 py-3">
											<form onSubmit={(ev) => actualizarTarea(ev)}>
												<div className="contact">
													<div className="row">
														<div className="form-group col-md-7">
															<label>Descripción</label>
															<input value={tareaEditar.desc_tarea} type="text" name="n-tarea-desc" className="form-control" id="n-tarea-desc" onChange={(ev) => setTareaEditar({ ...tareaEditar, "desc_tarea": ev.target.value })} />
														</div>
														<div className="form-group col-md-5" >
															<label>Recurso</label>
															<select value={tareaEditar.id_recurso} name="n-tarea-rec" id="n-tarea-rec" className="form-select" onChange={(ev) => setTareaEditar({ ...tareaEditar, "desc_recurso": ev.target.options[ev.target.selectedIndex].innerText, "id_recurso": ev.target.value })}>
																<option value="0">Seleccione</option>
																{
																	recursos.map(recurso => {
																		return (<option key={recurso.id} value={recurso.id}>{recurso.nombre}</option>)
																	})
																}
															</select>
														</div>
													</div>
													<br />
													<div className="row">
														<div className="form-group col-md-7">
															<label>Fecha</label>
															<input value={tareaEditar.fecha_tarea} type="date" name="n-tarea-fecha" className="form-control" id="n-tarea-fecha" onChange={(ev) => setTareaEditar({ ...tareaEditar, "fecha_tarea": ev.target.value })} />
														</div>
														<div className="form-group col-md-5">
															<label>Estado</label>
															<select value={tareaEditar.estado_tarea} name="n-tarea-estado" id="n-tarea-estado" className="form-select" onChange={(ev) => setTareaEditar({ ...tareaEditar, "estado_tarea": ev.target.value })}>
																<option value="0">No finalizado</option>
																<option value="1">Finalizado</option>
															</select>
														</div>
													</div>
													<div className="text-center mt-4"><button className="btn-tarea">Actualizar</button></div>
												</div>
											</form>
										</div>
									</div>
								</div>
							</Modal>
						</div>
					</div>
				</section>
			</main>
		</>
	)
}