import { db, collection, getDocs, doc, updateDoc, deleteDoc, getDoc, addDoc } from './firebase-config.js';

$(document).ready(function() {
  populateClientOptions();
  populateProductOptions();

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
      updateProductStock(orderData.productoId, orderData.cantidad);
    } catch (error) {
      console.error("Error añadiendo pedido: ", error);
    }
  });

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

  $(document).on("click", ".delete-order", async function() {
    const orderId = $(this).data("id");
    if (confirm("¿Estás seguro de eliminar este pedido?")) {
      try {
        const orderDoc = await getDoc(doc(db, "pedidos", orderId));
        if (orderDoc.exists()) {
          const order = orderDoc.data();
          await deleteDoc(doc(db, "pedidos", orderId));
          alert("Pedido eliminado exitosamente.");
          loadOrders();
          updateProductStock(order.productoId, -order.cantidad);
        }
      } catch (error) {
        console.error("Error eliminando pedido: ", error);
      }
    }
  });
});

async function populateClientOptions() {
  try {
    const querySnapshot = await getDocs(collection(db, "clientes"));
    let options = '<option value="">Seleccione un cliente</option>';
    querySnapshot.forEach((docSnap) => {
      const client = docSnap.data();
      options += `<option value="${docSnap.id}">${client.nombre}</option>`;
    });
    $("#orderClient").html(options);
  } catch (error) {
    console.error("Error cargando clientes: ", error);
  }
}

async function populateProductOptions() {
  try {
    const querySnapshot = await getDocs(collection(db, "productos"));
    let options = '<option value="">Seleccione un producto</option>';
    querySnapshot.forEach((docSnap) => {
      const product = docSnap.data();
      options += `<option value="${docSnap.id}">${product.nombre}</option>`;
    });
    $("#orderProduct").html(options);
  } catch (error) {
    console.error("Error cargando productos: ", error);
  }
}

async function updateProductStock(productId, quantityChange) {
  try {
    const productDoc = await getDoc(doc(db, "productos", productId));
    if (productDoc.exists()) {
      const product = productDoc.data();
      const newStock = product.stock - quantityChange;
      await updateDoc(doc(db, "productos", productId), {
        stock: newStock
      });
    }
  } catch (error) {
    console.error("Error actualizando stock del producto: ", error);
  }
}

export async function loadOrders() {
  try {
    const querySnapshot = await getDocs(collection(db, "pedidos"));
    let tableContent = '';
    for (const docSnap of querySnapshot.docs) {
      const order = docSnap.data();
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
              <button class="btn btn-sm btn-warning edit-order" data-id="${docSnap.id}">Editar</button>
              <button class="btn btn-sm btn-danger delete-order" data-id="${docSnap.id}">Eliminar</button>
            </td>
          </tr>`;
      }
    }
    $("#orderTableBody").html(tableContent);
  } catch (error) {
    console.error("Error cargando pedidos: ", error);
  }
}
