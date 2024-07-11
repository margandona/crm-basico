import { db, collection, getDocs, doc, updateDoc, deleteDoc, getDoc, addDoc } from './firebase-config.js';

$(document).ready(function() {
  $("#productForm").submit(async function(event) {
    event.preventDefault();
    const productData = {
      nombre: $("#productName").val(),
      descripcion: $("#productDescription").val(),
      precio: parseFloat($("#productPrice").val()),
      sku: $("#productSKU").val(),
      stock: parseInt($("#productStock").val())
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

  $(document).on("click", ".edit-product", async function() {
    const productId = $(this).data("id");
    try {
      const docSnap = await getDoc(doc(db, "productos", productId));
      if (docSnap.exists()) {
        const product = docSnap.data();
        $("#productName").val(product.nombre);
        $("#productDescription").val(product.descripcion);
        $("#productPrice").val(product.precio);
        $("#productSKU").val(product.sku);
        $("#productStock").val(product.stock);
        $("#productModalLabel").text("Editar Producto");
        $("#productModal").modal("show");
        $("#productForm").off('submit').submit(async function(event) {
          event.preventDefault();
          try {
            await updateDoc(doc(db, "productos", productId), {
              nombre: $("#productName").val(),
              descripcion: $("#productDescription").val(),
              precio: parseFloat($("#productPrice").val()),
              sku: $("#productSKU").val(),
              stock: parseInt($("#productStock").val())
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
});

export async function loadProducts(searchQuery = "") {
  try {
    const querySnapshot = await getDocs(collection(db, "productos"));
    let tableContent = '';
    querySnapshot.forEach((doc) => {
      const product = doc.data();
      if (product.nombre.toLowerCase().includes(searchQuery) || product.descripcion.toLowerCase().includes(searchQuery)) {
        tableContent += `
          <tr>
            <td>${product.nombre}</td>
            <td>${product.descripcion}</td>
            <td>${product.precio}</td>
            <td>${product.sku}</td>
            <td>${product.stock}</td>
            <td>
              <button class="btn btn-sm btn-warning edit-product" data-id="${doc.id}" data-toggle="tooltip" title="Editar"><i class="fas fa-edit"></i></button>
              <button class="btn btn-sm btn-danger delete-product" data-id="${doc.id}" data-toggle="tooltip" title="Eliminar"><i class="fas fa-trash"></i></button>
            </td>
          </tr>`;
      }
    });
    $("#productTableBody").html(tableContent);
    $('[data-toggle="tooltip"]').tooltip();
  } catch (error) {
    console.error("Error cargando productos: ", error);
  }
}
