import { auth, signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged, signOut, GoogleAuthProvider, signInWithPopup } from './firebase-config.js';
import { loadClients } from './clients.js';
import { loadProducts } from './products.js';
import { loadOrders } from './orders.js';

$(document).ready(function() {
  $(".section").hide();
  $(".protected").hide(); // Esconder todas las secciones protegidas por defecto

  $("#showClients").click(function() {
    $(".section").hide();
    $("#clientsSection").show();
  });

  $("#showProducts").click(function() {
    $(".section").hide();
    $("#productsSection").show();
  });

  $("#showOrders").click(function() {
    $(".section").hide();
    $("#ordersSection").show();
  });

  $("#showReports").click(function() {
    $(".section").hide();
    // Mostrar sección de informes si es necesario
  });

  $("#loginForm").submit(async function(event) {
    event.preventDefault();
    const email = $("#loginEmail").val();
    const password = $("#loginPassword").val();

    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert("Inicio de sesión exitoso.");
      $("#loginForm")[0].reset();
      $("#loginModal").modal('hide');
      $(".protected").show();
    } catch (error) {
      console.error("Error iniciando sesión: ", error);
    }
  });

  $("#registerForm").submit(async function(event) {
    event.preventDefault();
    const email = $("#registerEmail").val();
    const password = $("#registerPassword").val();

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      alert("Registro exitoso.");
      $("#registerForm")[0].reset();
      $("#registerModal").modal('hide');
      $(".protected").show();
    } catch (error) {
      console.error("Error registrándose: ", error);
    }
  });

  $("#logoutBtn").click(async function() {
    try {
      await signOut(auth);
      alert("Cierre de sesión exitoso.");
      $(".section").hide();
      $(".protected").hide();
    } catch (error) {
      console.error("Error cerrando sesión: ", error);
    }
  });

  onAuthStateChanged(auth, (user) => {
    if (user) {
      $(".protected").show();
    } else {
      $(".protected").hide();
    }
  });

  // Inicio de sesión con Google
  $("#googleLoginBtn").click(async function() {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      alert("Inicio de sesión con Google exitoso.");
      $(".protected").show();
    } catch (error) {
      console.error("Error iniciando sesión con Google: ", error);
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
});
