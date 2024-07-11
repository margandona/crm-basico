import { 
  auth, 
  googleProvider, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  onAuthStateChanged, 
  signOut, 
  signInWithPopup 
} from './firebase-config.js';
import { loadClients } from './clients.js';
import { loadProducts } from './products.js';
import { loadOrders } from './orders.js';
import { db, collection, getDocs } from './firebase-config.js';

$(document).ready(function() {
  $(".section").hide();
  $(".protected").hide(); // Esconder todas las secciones protegidas por defecto

  // Mostrar/Ocultar secciones
  $("#navClients").click(function() {
    $(".section").hide();
    $("#clientsSection").show();
  });

  $("#navProducts").click(function() {
    $(".section").hide();
    $("#productsSection").show();
  });

  $("#navOrders").click(function() {
    $(".section").hide();
    $("#ordersSection").show();
  });

  $("#navReports").click(function() {
    $(".section").hide();
    $("#reportsSection").show();
  });

  // Toggle sidebar
  $("#toggleSidebar").click(function() {
    $("#sidebar").toggle();
  });

  // Toggle dark mode
  $("#toggleDarkMode").click(function() {
    $("body").toggleClass("dark-mode");
  });

  // Validaciones avanzadas y notificaciones
  function showNotification(type, message) {
    const notification = $(`<div class="alert alert-${type} alert-dismissible fade show" role="alert">
      ${message}
      <button type="button" class="close" data-dismiss="alert" aria-label="Close">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>`);
    $(".content").prepend(notification);
    setTimeout(() => {
      notification.alert('close');
    }, 3000);
  }

  $("#loginForm").submit(async function(event) {
    event.preventDefault();
    const email = $("#loginEmail").val();
    const password = $("#loginPassword").val();

    try {
      await signInWithEmailAndPassword(auth, email, password);
      showNotification("success", "Inicio de sesión exitoso.");
      $("#loginForm")[0].reset();
      $("#loginModal").modal('hide');
      $(".protected").show();
      loadProtectedData();
    } catch (error) {
      showNotification("danger", "Error iniciando sesión: " + error.message);
    }
  });

  $("#registerForm").submit(async function(event) {
    event.preventDefault();
    const email = $("#registerEmail").val();
    const password = $("#registerPassword").val();

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      showNotification("success", "Registro exitoso.");
      $("#registerForm")[0].reset();
      $("#registerModal").modal('hide');
      $(".protected").show();
      loadProtectedData();
    } catch (error) {
      showNotification("danger", "Error registrándose: " + error.message);
    }
  });

  $("#logoutBtn").click(async function() {
    try {
      await signOut(auth);
      showNotification("success", "Cierre de sesión exitoso.");
      $(".section").hide();
      $(".protected").hide();
    } catch (error) {
      showNotification("danger", "Error cerrando sesión: " + error.message);
    }
  });

  onAuthStateChanged(auth, (user) => {
    if (user) {
      $(".protected").show();
      loadProtectedData();
    } else {
      $(".protected").hide();
    }
  });

  // Inicio de sesión con Google
  $("#googleLoginBtn, #googleRegisterBtn").click(async function() {
    try {
      await signInWithPopup(auth, googleProvider);
      showNotification("success", "Inicio de sesión con Google exitoso.");
      $(".protected").show();
      $(".modal").modal('hide');
      loadProtectedData();
    } catch (error) {
      showNotification("danger", "Error iniciando sesión con Google: " + error.message);
    }
  });

  // Mostrar datos al hacer clic en el botón
  $("#showClientsTableBtn").click(function() {
    loadClients();
  });

  $("#showProductsTableBtn").click(function() {
    loadProducts();
  });

  $("#showOrdersTableBtn").click(function() {
    loadOrders();
  });

  function loadProtectedData() {
    loadClients();
    loadProducts();
    loadOrders();
  }

  // Buscadores con AJAX
  $("#searchClients").on("input", function() {
    const searchQuery = $(this).val().toLowerCase();
    loadClients(searchQuery);
  });

  $("#searchProducts").on("input", function() {
    const searchQuery = $(this).val().toLowerCase();
    loadProducts(searchQuery);
  });

  $("#searchOrders").on("input", function() {
    const searchQuery = $(this).val().toLowerCase();
    loadOrders(searchQuery);
  });

  // Generar reportes
  $("#generateClientsReport").click(function() {
    generateReport('clientes');
  });

  $("#generateProductsReport").click(function() {
    generateReport('productos');
  });

  $("#generateOrdersReport").click(function() {
    generateReport('pedidos');
  });

  async function generateReport(type) {
    let collectionName = '';
    if (type === 'clientes') collectionName = 'clientes';
    if (type === 'productos') collectionName = 'productos';
    if (type === 'pedidos') collectionName = 'pedidos';

    try {
      const querySnapshot = await getDocs(collection(db, collectionName));
      let reportContent = `<h3>Reporte de ${type}</h3>`;
      reportContent += '<table class="table table-bordered"><thead><tr>';
      
      // Adding headers based on type
      if (type === 'clientes') {
        reportContent += '<th>Nombre</th><th>Email</th><th>Teléfono</th><th>Dirección</th>';
      } else if (type === 'productos') {
        reportContent += '<th>Nombre</th><th>Descripción</th><th>Precio</th><th>SKU</th><th>Stock</th>';
      } else if (type === 'pedidos') {
        reportContent += '<th>Cliente</th><th>Producto</th><th>Cantidad</th><th>Fecha</th>';
      }

      reportContent += '</tr></thead><tbody>';
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        reportContent += '<tr>';
        if (type === 'clientes') {
          reportContent += `<td>${data.nombre}</td><td>${data.email}</td><td>${data.telefono}</td><td>${data.direccion}</td>`;
        } else if (type === 'productos') {
          reportContent += `<td>${data.nombre}</td><td>${data.descripcion}</td><td>${data.precio}</td><td>${data.sku}</td><td>${data.stock}</td>`;
        } else if (type === 'pedidos') {
          reportContent += `<td>${data.cliente}</td><td>${data.producto}</td><td>${data.cantidad}</td><td>${data.fecha}</td>`;
        }
        reportContent += '</tr>';
      });

      reportContent += '</tbody></table>';
      $("#reportsContent").html(reportContent);
    } catch (error) {
      showNotification("danger", `Error generando reporte de ${type}: ` + error.message);
    }
  }
});
