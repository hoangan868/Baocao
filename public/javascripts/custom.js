
$(document).ready(function(){
	// load_json_data('Tỉnh, thành phố');
	// function load_json_data(id, parent_id)
	// {
	// 	var html_code ='';
	// 	$.getJSON('/json/countries.json', function(data){
	// 		html_code += '<option value="">Select '+ id +'</option>';
	// 		$.each(data, function(key, value){
	// 			if(id == 'Tỉnh, thành phố')
	// 			{
	// 				if(value.parent_id == '0')
	// 				{
	// 					console.log('sdsd');
	// 					html_code +='<option value="'+value.id+'">'+value.name+'</option>';
	// 				}
	// 			} else {
	// 				if(value.parent_id == parent_id){
	// 					html_code += '<option value="'+value.id+'">'+value.name+'</option>';
	// 					//html_code += '<option value=""> Tỉnh, thành phố</option>';
	// 				}
	// 			}
	// 		});
	// 		$('#'+id).html(html_code);
	// 	});
	// }
	$(document).on('change','#provine', function(){
		// var country_id = $(this).val();
		// if(country_id != ''){
		// 	load_json_data('state', country_id);
		// } else {
		// 	$('#state').html('<option value="">Quận, huyện</option>');
		// 	//$('#city').html('<option value="">Select city</option>');
		// }
		var html_code = '';
		if()
		$('#'+id).html(html_code);
	});
	
});
