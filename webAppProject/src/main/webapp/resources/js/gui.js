var leftMenuOpen = false;

function changeStateLeftMenu(){
	if(leftMenuOpen === true){
		closeLeftMenu();
	} else {
		openLeftMenu();
	}
}

function openLeftMenu(){
	jQuery("#dropMenuContentContainer").removeClass('dropMenuContentContainerClose');
	jQuery("#dropMenuContentContainer").addClass('dropMenuContentContainerOpen');
	jQuery("#dropMenuContainer").removeClass('dropMenuContainerClose');
	jQuery("#dropMenuContainer").addClass('dropMenuContainerOpen');
	jQuery("#droprightClickMenuImg").css('display','none');
	jQuery("#dropleftClickMenuImg").css('display','block');
	leftMenuOpen = true;
}

function closeLeftMenu(){
	jQuery("#dropMenuContentContainer").removeClass('dropMenuContentContainerOpen');
	jQuery("#dropMenuContentContainer").addClass('dropMenuContentContainerClose');
	jQuery("#dropMenuContainer").removeClass('dropMenuContainerOpen');
	jQuery("#dropMenuContainer").addClass('dropMenuContainerClose');
	jQuery("#droprightClickMenuImg").css('display','block');
	jQuery("#dropleftClickMenuImg").css('display','none');
	leftMenuOpen = false;
}

function showLoading(){
	var imageHtml = "";
	swal({   title: "Loading", text:imageHtml,showConfirmButton:false, allowEscapeKey:false,html:true,   type: null,   showCancelButton: false,   closeOnConfirm: false,   showLoaderOnConfirm: false, });
}

function closeLoading(){
	swal.close();
}

function generateImage(){
	jQuery('#imageContainerZoomAndPan').imagePanAndZoom(null);
	showLoading()
	ajaxPost('webapi/methods/generateImage',{config:JSON.stringify(configJSON)},function(data){
		if(!isError(data)){
			closeLoading();
			jQuery('#imageContainerZoomAndPan').imagePanAndZoom('webapi/methods/getImage.svg?d='+new Date().getTime());
		}
	},function(error){
		swal("Generate error:",error,"error");
	});
}

function bindEvents(){
	var touch=null;
	var tryToOpenOrClose = false;
	var abriendo = false;
	var cerrando = false;
	jQuery("#mobileLeftMenuEvents").bind("touchstart",function(event){
		event.stopImmediatePropagation();
		if(event.preventDefault){
		        event.preventDefault();
		}
		var ev = event.originalEvent;
		if (ev.targetTouches.length == 1) {
			touch = ev.targetTouches[0];
		}
	});
	jQuery("#mobileLeftMenuEvents").bind("touchmove",function(event){
		event.stopImmediatePropagation();
		if(event.preventDefault){
		        event.preventDefault();
		}
		var ev = event.originalEvent;
		if (ev.targetTouches.length == 1) {
			var distance = ev.targetTouches[0].pageX - touch.pageX;
			if(distance > 0){
				if(!cerrando){
					abriendo = true;
					if(Math.abs(distance) < 0.7*jQuery("#dropMenuContainer").width()){			
						var px = -jQuery("#dropMenuContainer").width()+jQuery("#mobileLeftMenuEvents").width()+Math.abs(distance);					
						jQuery("#dropMenuContainer").css("left",px+"px");
						tryToOpenOrClose = true;
					}else{
						jQuery("#dropMenuContainer").css("left","");
						openLeftMenu();
						tryToOpenOrClose = false;
					}
				}
			}else if(distance < 0){
				if(!abriendo){
					cerrando = true;
					if(Math.abs(distance) < 0.7*jQuery("#dropMenuContainer").width()){
						var px = -Math.abs(distance);		
						jQuery("#dropMenuContainer").css("left",px+"px");
						tryToOpenOrClose = true;
					}else{
						jQuery("#dropMenuContainer").css("left","");
						closeLeftMenu();
						tryToOpenOrClose = false;
					}
				}
			}
		}
	});
	jQuery("#mobileLeftMenuEvents").bind("touchend",function(event){
		event.stopImmediatePropagation();
		if(event.preventDefault){
		        event.preventDefault();
		}
		abriendo = false;
		cerrando = false;
		if (tryToOpenOrClose) {
			jQuery("#dropMenuContainer").css("left","");
		}
	});
}

function isArray(object){
	if(object === null){
		return false;
	}
	return object.constructor === [].constructor;
}

function isObject(object){
	if(object === null){
		return false;
	}
	return object.constructor === {}.constructor;
}

function isString(object){
	if(object === null){
		return false;
	}
	return object.constructor === "".constructor;
}

function addAttributes(container,json){
	jQuery.each(json["css"],function(i,css){
		jQuery(container).css(i,css);
	});
	jQuery.each(json["attr"],function(i,attr){
		jQuery(container).attr(i,attr);
	});
	jQuery.each(json["class"],function(i,classe){
		jQuery(container).addClass(classe);
	});
}

function drawConfig(container,configJSON,configTaxonomyJSON){
	if(isArray(configTaxonomyJSON)){
		jQuery.each(configTaxonomyJSON,function(i,obj){
			if(obj["type"] === "CONTAINER"){
				var newContainer = document.createElement(obj["container"]);
				container.appendChild(newContainer);
				if(obj["param"]){
					jQuery(newContainer).attr("name",obj["param"]);
				}
				if(obj["attributes"]){
					addAttributes(newContainer,obj["attributes"]);
				}
				if(obj["content"]){
					drawConfig(newContainer,configJSON[obj["param"]],obj["content"]);
				}
			}
			if(obj["type"] === "VALUE"){
				
			}
		});
	}else{
		window.alert("Error in generate config the JSON: "+configTaxonomyJSON+" in not a array");
	}
}

function getDefaultConfig(){
	
}
var configTaxonomyJSON=[ { "param":"keys", "container":"DIV", "type":"CONTAINER", "content": [ { "param":"imageSize", "container":"DIV", "type":"CONTAINER", "content":[{"type":"value","container":"DIV","attributes":{"css":{},"attr":{"contenteditable":"true"},"class":{}}}] }, { "param":"arrowColor", "container":"CHECKBOX", "type":"CONTAINER", "content":[{"container":"DIV","attributes":{"css":{},"attr":{"contenteditable":"true"},"class":{}}}] } ] } ];
var configJSON={"equivalentElementList":[],"ignoreElementList":[],"includeOnlyElementList":[],"keys":{"arrowColor":"black","literalShape":"rectangle","individualShape":"rectangle","classShape":"rectangle","nodeNameMode":"localname","arrowhead":"normal","literalColor":"black","rankdir":"LR","classColor":"black","arrowdir":"forward","ignoreRdfType":false,"ignoreLiterals":false,"individualColor":"black","imageSize":"1500","arrowtail":"normal","synthesizeObjectProperties":false},"specialElementsList":[]};
//var configJSON={"equivalentElementList":[],"ignoreElementList":["http://www.w3.org/2000/01/rdf-schema#subClassOf"],"includeOnlyElementList":[],"specialElementsList":[],"keys":{"arrowColor":"green","literalShape":"ellipse","individualShape":"triangle","classShape":"diamond","nodeNameMode":"fulluri","arrowhead":"odot","literalColor":"orange","rankdir":"TB","classColor":"blue","arrowdir":"forward","ignoreRdfType":"true","ignoreLiterals":"true","individualColor":"red","imageSize":"1501","arrowtail":"dot","synthesizeObjectProperties":"true"}};
function generateConfig(config){
	//#dropMenuContentContainer #configContainer
	//var container = document.getElementById("configContainer");
	//drawConfig(container, configJSON, configTaxonomyJSON)
	putConfigValuesToConfigView(configJSON,jQuery("#configContainer"));
	bindConfigEvents();
}

function putConfigValuesToConfigView(json,container){
	jQuery.each(json,function(key,value){
		if(isObject(json[key])){
			putConfigValuesToConfigView(json[key], jQuery(container).find('[configContainer='+key+']')[0]);
		}else{
			changeValueOfContainer(jQuery(container).find('[configParam='+key+'] [configValue]')[0], value);
		}
	});
}

function changeValueOfContainer(container,value){
	if(jQuery(container).is("option")){
		var select = jQuery(container).parent()[0];
		jQuery(select).val(value);
	}else if(jQuery(container).is("input[type=checkbox]")){
		jQuery(container).prop( "checked", value );
	}else if(jQuery(container).is("input")){
		if(!isString(value)){
			jQuery(container).val(JSON.stringify(value));
		}else{
			jQuery(container).val(value);
		}
	}else{
		var parent = jQuery(container).parent()[0];
		jQuery(parent).children("[configValue]").removeClass("selected").addClass("notSelected");
		jQuery(parent).children('[configValue='+value+']').removeClass("notSelected").addClass("selected");
	}
}

function bindConfigEvents(){
	jQuery("#configContainer").find("[configParam]").each(function(i,param){
		jQuery(param).find("[configValue]").each(function(i,value){
			if(jQuery(value).is("option")){
				if(!jQuery(jQuery(value).parent()[0]).hasHandlers("change")){
					jQuery(jQuery(value).parent()[0]).change(function(){
						configJSON["keys"][jQuery(param).attr("configParam")]=jQuery(this).val();
					});
				}
			}else if(jQuery(value).is("input[type=checkbox]")){
				if(!jQuery(jQuery(value).parent()[0]).hasHandlers("change")){
					jQuery(jQuery(value).parent()[0]).change(function(){
						configJSON["keys"][jQuery(param).attr("configParam")]=jQuery(value).is(":checked");
					});
				}
			}else if(jQuery(value).is("input")){
				if(!jQuery(value).hasHandlers("change")){
					jQuery(value).change(function(){
						var parentContainerID = jQuery(jQuery(value).closest("[configContainer]")[0]).attr("configContainer");
						if(!jQuery(jQuery(value).parent()[0]).is("[configContainer]")){
							configJSON[parentContainerID][jQuery(param).attr("configParam")]=JSON.parse(jQuery(value).val());
						}else{
							configJSON[parentContainerID]=JSON.parse(jQuery(value).val());
						}
					});
				}
			}else{
				jQuery(value).click(function(e){
					configJSON["keys"][jQuery(param).attr("configParam")]=jQuery(value).attr("configValue");
					jQuery(param).find("[configValue]").each(function(i,toChange){
						jQuery(toChange).removeClass("selected").addClass("notSelected");
					});
					jQuery(value).removeClass("notSelected").addClass("selected");
				});
			}
		});
	});
}

function ajaxPost(urlString,data,funcionDone,funcionError){
	jQuery.ajax({
		url: urlString,
	    type: "POST",
	    data : data,
	    contentType: 'application/x-www-form-urlencoded'
	}).done(funcionDone).error(funcionError);
}
function ajaxGet(urlString,data,funcionDone,funcionError){
	if(data && data.length>0){
		urlString+='?';
		jQuery.each(data,function(key,val){
			urlString+=key+'='+val+'&';
		});
		urlString = urlString.substring(0,urlString.length-1);
	}
	urlString = encodeURI(urlString);
	jQuery.ajax({
		url: urlString,
	    type: "GET",
	    contentType: 'application/x-www-form-urlencoded'
	}).done(funcionDone).error(funcionError);
}

function ajaxUploadFile(idContainer,idInput){
	var urlString="webapi/methods/uploadFile";
	var fd = new FormData(document.getElementById(idContainer));
	if(idInput){
		var input = document.getElementById(idInput);
		if(input && input.files && input.files[0]){
			fd.append("fileSize",input.files[0].size);
			console.log("Uploaded file size: "+input.files[0].size+" bytes");
		}
	}
    jQuery.ajax({
      url: urlString,
      type: "POST",
      data: fd,
      enctype: 'multipart/form-data',
      processData: false,  // tell jQuery not to process the data
      contentType: false   // tell jQuery not to set contentType
    }).done(function( data ) {
    	if(!isError(data,function(isConfirm){showUploadPopUp()})){
    		swal("Uploaded file", "The file has been uploaded.", "success");
    	}
    }).error(function(error){
    	swal("Upload error",error,"error");
    });
}

function isError(response,callback){
	if(response["errorResponse"]){
		if(response["idErrorMessage"]){
			if(callback){
				//swal("Service error",response["idErrorMessage"]+":"+response["errorMessage"],"error",callback);
				swal({title: "Service error",   text:response["idErrorMessage"]+":"+response["errorMessage"] ,   type: "error",closeOnConfirm: false,   closeOnCancel: false},callback);
			}else{
				swal({title: "Service error",   text:response["idErrorMessage"]+":"+response["errorMessage"] ,   type: "error",closeOnConfirm: false,   closeOnCancel: false});
				//swal("Service error",response["idErrorMessage"]+":"+response["errorMessage"],"error");
			}
		}else{
			if(callback){
				swal({title: "Service error",   text:response["errorMessage"] ,   type: "error",closeOnConfirm: false,   closeOnCancel: false},callback);
				//swal("Service error",response["errorMessage"],"error",callback);
			}else{
				swal({title: "Service error",   text:response["errorMessage"] ,   type: "error",closeOnConfirm: false,   closeOnCancel: false});
				//swal("Service error",response["errorMessage"],"error");
			}
		}
		return true;
	}
	return false;
}

function showUploadPopUp(){
	var formText = '<form id="uploadFileForm" action="webapi/methods/uploadFile" method="post" enctype="multipart/form-data"><input id="uploadFileInput" type="file" name="file" multiple="false" style="display:block;margin-top:10px;padding:0px 0px 43px 0px;"><p> or put a URI:</p><input type="text" name="uri" style="display:block;margin-top:10px;">';
	swal({   title: "Upload a file",   text: formText,allowEscapeKey:false,html:true,   type: null,   showCancelButton: false,   closeOnConfirm: false,   showLoaderOnConfirm: true, }, function(){
		ajaxUploadFile("uploadFileForm","uploadFileInput","uploadFileSizeInput");
	});
}

function startWebPage(){
	var hasUploadedFile = 'webapi/methods/hasUploadedFile';
	showLoading();
	ajaxGet(hasUploadedFile,null,function( data ) {
		if(!isError(data)){
    		var response = JSON.parse(data['response']);
    		if(response && response['hasUploadedFile'] && response['hasUploadedFile']==true){
    			if(response['hasGeneratedImage'] && response['hasGeneratedImage']==true){
    				jQuery('#imageContainerZoomAndPan').imagePanAndZoom('webapi/methods/getImage.svg?d='+new Date().getTime());
    				closeLoading();
    			}else{
    				generateImage();
    			}
    		}else{
    			showUploadPopUp();
    		}
    	}
    },function(error){
    	swal("HasUploadedFile error",error,"error");
    });
	
}

window.onload = function(){
	if( window.jQuery ) {
		bindEvents();
		generateConfig();
		startWebPage();
	} else {
		window.setTimeout( runScript, 100 );
	}
};


