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

// Cargar productos al inicio
$(document).ready(function() {
    loadClients();
    loadProducts();
  });
  
  // Función para añadir producto
  $("#productForm").submit(async function(event) {
    event.preventDefault();
    const productData = {
      nombre: $("#productName").val(),
      descripcion: $("#productDescription").val(),
      precio: parseFloat($("#productPrice").val())
    };
  
    try {
      await addDoc(collection(db, "productos"), productData);
      alert("Producto añadido exitosamente.");
      $("#productForm")[0].reset();
      $("#productModal").modal('hide');
      loadProducts();
    } catch (error) {
      console.error("Error añadiendo producto: ", error);
    }
  });
  
  // Función para cargar productos
  async function loadProducts() {
    try {
      const querySnapshot = await getDocs(collection(db, "productos"));
      let tableContent = '';
      querySnapshot.forEach((doc) => {
        const product = doc.data();
        tableContent += `
          <tr>
            <td>${product.nombre}</td>
            <td>${product.descripcion}</td>
            <td>${product.precio}</td>
            <td>
              <button class="btn btn-sm btn-warning edit-product" data-id="${doc.id}">Editar</button>
              <button class="btn btn-sm btn-danger delete-product" data-id="${doc.id}">Eliminar</button>
            </td>
          </tr>`;
      });
      $("#productTableBody").html(tableContent);
    } catch (error) {
      console.error("Error cargando productos: ", error);
    }
  }
  
  // Función para editar producto
  $(document).on("click", ".edit-product", async function() {
    const productId = $(this).data("id");
    try {
      const docSnap = await getDoc(doc(db, "productos", productId));
      if (docSnap.exists()) {
        const product = docSnap.data();
        $("#productName").val(product.nombre);
        $("#productDescription").val(product.descripcion);
        $("#productPrice").val(product.precio);
        $("#productModalLabel").text("Editar Producto");
        $("#productModal").modal("show");
        $("#productForm").off('submit').submit(async function(event) {
          event.preventDefault();
          try {
            await updateDoc(doc(db, "productos", productId), {
              nombre: $("#productName").val(),
              descripcion: $("#productDescription").val(),
              precio: parseFloat($("#productPrice").val())
            });
            alert("Producto actualizado exitosamente.");
            $("#productForm")[0].reset();
            $("#productModal").modal('hide');
            loadProducts();
          } catch (error) {
            console.error("Error actualizando producto: ", error);
          }
        });
      }
    } catch (error) {
      console.error("Error obteniendo datos del producto: ", error);
    }
  });
  
  // Función para eliminar producto
  $(document).on("click", ".delete-product", async function() {
    const productId = $(this).data("id");
    if (confirm("¿Estás seguro de eliminar este producto?")) {
      try {
        await deleteDoc(doc(db, "productos", productId));
        alert("Producto eliminado exitosamente.");
        loadProducts();
      } catch (error) {
        console.error("Error eliminando producto: ", error);
      }
    }
  });

  // Cargar pedidos al inicio
$(document).ready(function() {
    loadClients();
    loadProducts();
    loadOrders();
    populateClientOptions();
    populateProductOptions();
  });
  
  // Función para añadir pedido
  $("#orderForm").submit(async function(event) {
    event.preventDefault();
    const orderData = {
      clienteId: $("#orderClient").val(),
      productoId: $("#orderProduct").val(),
      cantidad: parseInt($("#orderQuantity").val()),
      fecha: new Date().toISOString()
    };
  
    try {
      await addDoc(collection(db, "pedidos"), orderData);
      alert("Pedido añadido exitosamente.");
      $("#orderForm")[0].reset();
      $("#orderModal").modal('hide');
      loadOrders();
    } catch (error) {
      console.error("Error añadiendo pedido: ", error);
    }
  });
  
  // Función para cargar pedidos
  async function loadOrders() {
    try {
      const querySnapshot = await getDocs(collection(db, "pedidos"));
      let tableContent = '';
      for (const doc of querySnapshot.docs) {
        const order = doc.data();
        const clientDoc = await getDoc(doc(db, "clientes", order.clienteId));
        const productDoc = await getDoc(doc(db, "productos", order.productoId));
        if (clientDoc.exists() && productDoc.exists()) {
          const client = clientDoc.data();
          const product = productDoc.data();
          tableContent += `
            <tr>
              <td>${client.nombre}</td>
              <td>${product.nombre}</td>
              <td>${order.cantidad}</td>
              <td>${new Date(order.fecha).toLocaleString()}</td>
              <td>
                <button class="btn btn-sm btn-warning edit-order" data-id="${doc.id}">Editar</button>
                <button class="btn btn-sm btn-danger delete-order" data-id="${doc.id}">Eliminar</button>
              </td>
            </tr>`;
        }
      }
      $("#orderTableBody").html(tableContent);
    } catch (error) {
      console.error("Error cargando pedidos: ", error);
    }
  }
  
  // Función para popular opciones de clientes
  async function populateClientOptions() {
    try {
      const querySnapshot = await getDocs(collection(db, "clientes"));
      let options = '<option value="">Seleccione un cliente</option>';
      querySnapshot.forEach((doc) => {
        const client = doc.data();
        options += `<option value="${doc.id}">${client.nombre}</option>`;
      });
      $("#orderClient").html(options);
    } catch (error) {
      console.error("Error cargando clientes: ", error);
    }
  }
  
  // Función para popular opciones de productos
  async function populateProductOptions() {
    try {
      const querySnapshot = await getDocs(collection(db, "productos"));
      let options = '<option value="">Seleccione un producto</option>';
      querySnapshot.forEach((doc) => {
        const product = doc.data();
        options += `<option value="${doc.id}">${product.nombre}</option>`;
      });
      $("#orderProduct").html(options);
    } catch (error) {
      console.error("Error cargando productos: ", error);
    }
  }
  
  // Función para editar pedido
  $(document).on("click", ".edit-order", async function() {
    const orderId = $(this).data("id");
    try {
      const docSnap = await getDoc(doc(db, "pedidos", orderId));
      if (docSnap.exists()) {
        const order = docSnap.data();
        $("#orderClient").val(order.clienteId);
        $("#orderProduct").val(order.productoId);
        $("#orderQuantity").val(order.cantidad);
        $("#orderModalLabel").text("Editar Pedido");
        $("#orderModal").modal("show");
        $("#orderForm").off('submit').submit(async function(event) {
          event.preventDefault();
          try {
            await updateDoc(doc(db, "pedidos", orderId), {
              clienteId: $("#orderClient").val(),
              productoId: $("#orderProduct").val(),
              cantidad: parseInt($("#orderQuantity").val())
            });
            alert("Pedido actualizado exitosamente.");
            $("#orderForm")[0].reset();
            $("#orderModal").modal('hide');
            loadOrders();
          } catch (error) {
            console.error("Error actualizando pedido: ", error);
          }
        });
      }
    } catch (error) {
      console.error("Error obteniendo datos del pedido: ", error);
    }
  });
  
  // Función para eliminar pedido
  $(document).on("click", ".delete-order", async function() {
    const orderId = $(this).data("id");
    if (confirm("¿Estás seguro de eliminar este pedido?")) {
      try {
        await deleteDoc(doc(db, "pedidos", orderId));
        alert("Pedido eliminado exitosamente.");
        loadOrders();
      } catch (error) {
        console.error("Error eliminando pedido: ", error);
      }
    }
  });

  import { auth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from './firebase-config.js';

// Función para iniciar sesión
$("#loginForm").submit(async function(event) {
  event.preventDefault();
  const email = $("#loginEmail").val();
  const password = $("#loginPassword").val();

  try {
    await signInWithEmailAndPassword(auth, email, password);
    alert("Inicio de sesión exitoso.");
    $("#loginForm")[0].reset();
    $("#loginModal").modal('hide');
    // Mostrar contenido protegido
    $(".protected").show();
  } catch (error) {
    console.error("Error iniciando sesión: ", error);
  }
});

// Función para registrarse
$("#registerForm").submit(async function(event) {
  event.preventDefault();
  const email = $("#registerEmail").val();
  const password = $("#registerPassword").val();

  try {
    await createUserWithEmailAndPassword(auth, email, password);
    alert("Registro exitoso.");
    $("#registerForm")[0].reset();
    $("#registerModal").modal('hide');
    // Mostrar contenido protegido
    $(".protected").show();
  } catch (error) {
    console.error("Error registrándose: ", error);
  }
});

// Verificar si el usuario está autenticado
auth.onAuthStateChanged(user => {
  if (user) {
    $(".protected").show();
  } else {
    $(".protected").hide();
  }
});
