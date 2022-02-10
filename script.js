function calcularLUCRO() {
	   var formulario = document.getElementById("formulario");

	   var papel = formulario.papel.value;
	   var valorpapel = formulario.valorpapel.value;
	   var papelao = formulario.papelao.value;
     var valorpapelao = formulario.valorpapelao.value;
     var miolo = formulario.miolo.value;
     var valormiolo = formulario.valormiolo.value;
     var cartao = formulario.cartao.value;
     var valorcartao = formulario.valorcartao.value;
     var wireo = formulario.wireo.value;
     var valorwireo = formulario.valorwireo.value;
     var venda = formulario.venda.value;
  

	   var total = (papel*valorpapel) + (papelao*valorpapelao) + (miolo*valormiolo) + (cartao*valorcartao)  + (wireo*valorwireo);
     var lucro = (venda-total)

      
	   if (lucro < 0){
	   alert("VocÊ não está tendo lucro");
	   }else{
	    alert("Seu lucro é de:" + lucro);
     }
}