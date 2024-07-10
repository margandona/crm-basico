// app.js
import { db, collection, addDoc, getDocs, doc, updateDoc, deleteDoc, getDoc } from './firebase-config.js';

$(document).ready(function() {
  loadClients();
});

$("#clientForm").submit(async function(event) {
  event.preventDefault();
  const clientData = {
    nombre: $("#clientName").val(),
    email: $("#clientEmail").val(),
    telefono: $("#clientPhone").val(),
    direccion: $("#clientAddress").val()
  };

  try {
    await addDoc(collection(db, "clientes"), clientData);
    alert("Cliente añadido exitosamente.");
    $("#clientForm")[0].reset();
    $("#clientModal").modal('hide');
    loadClients();
  } catch (error) {
    console.error("Error añadiendo cliente: ", error);
  }
});

async function loadClients() {
  try {
    const querySnapshot = await getDocs(collection(db, "clientes"));
    let tableContent = '';
    querySnapshot.forEach((doc) => {
      const client = doc.data();
      tableContent += `
        <tr>
          <td>${client.nombre}</td>
          <td>${client.email}</td>
          <td>${client.telefono}</td>
          <td>${client.direccion}</td>
          <td>
            <button class="btn btn-sm btn-warning edit-client" data-id="${doc.id}">Editar</button>
            <button class="btn btn-sm btn-danger delete-client" data-id="${doc.id}">Eliminar</button>
          </td>
        </tr>`;
    });
    $("#clientTableBody").html(tableContent);
  } catch (error) {
    console.error("Error cargando clientes: ", error);
  }
}

$(document).on("click", ".edit-client", async function() {
  const clientId = $(this).data("id");
  try {
    const docSnap = await getDoc(doc(db, "clientes", clientId));
    if (docSnap.exists()) {
      const client = docSnap.data();
      $("#clientName").val(client.nombre);
      $("#clientEmail").val(client.email);
      $("#clientPhone").val(client.telefono);
      $("#clientAddress").val(client.direccion);
      $("#clientModalLabel").text("Editar Cliente");
      $("#clientModal").modal("show");
      $("#clientForm").off('submit').submit(async function(event) {
        event.preventDefault();
        try {
          await updateDoc(doc(db, "clientes", clientId), {
            nombre: $("#clientName").val(),
            email: $("#clientEmail").val(),
            telefono: $("#clientPhone").val(),
            direccion: $("#clientAddress").val()
          });
          alert("Cliente actualizado exitosamente.");
          $("#clientForm")[0].reset();
          $("#clientModal").modal('hide');
          loadClients();
        } catch (error) {
          console.error("Error actualizando cliente: ", error);
        }
      });
    }
  } catch (error) {
    console.error("Error obteniendo datos del cliente: ", error);
  }
});

$(document).on("click", ".delete-client", async function() {
  const clientId = $(this).data("id");
  if (confirm("¿Estás seguro de eliminar este cliente?")) {
    try {
      await deleteDoc(doc(db, "clientes", clientId));
      alert("Cliente eliminado exitosamente.");
      loadClients();
    } catch (error) {
      console.error("Error eliminando cliente: ", error);
    }
  }
});