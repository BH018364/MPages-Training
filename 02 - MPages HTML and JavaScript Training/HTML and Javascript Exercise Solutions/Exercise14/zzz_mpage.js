function verify(){
    // 0 Object is not initialized
    // 1 Loading object is loading data
    // 2 Loaded object has loaded data
    // 3 Data from object can be worked with
    // 4 Object completely initialized
    if (xmlDoc.readyState != 4){
        return (false);
    }
}
 
function loadXMLString(txt) {
	try //Internet Explorer
	{
		//this creates the nex XML object
		xmlDoc=new ActiveXObject("Microsoft.XMLDOM");
		xmlDoc.async="false";
		xmlDoc.onreadystatechange=verify;
		xmlDoc.loadXML(txt);
		return(xmlDoc);
	}
	catch(e)
	{
		try //Firefox, Mozilla, Opera, etc.
		{
			parser=new DOMParser();
			xmlDoc=parser.parseFromString(txt,"text/xml");
			return(xmlDoc);
		}
		catch(e) {alert(e.message);}
	}
	alert('returning null...');
	return(null);
}

function getEvents(){
	// Call functions to format html and populate sections
	patientInfoTable(); 
	allergyInfoTable();
	docTable();
}

function patientInfoTable(){
	// Initialize the request object
	var patInfo = new XMLCclRequest();

	// Get the response
	patInfo.onreadystatechange = function () {
		if (patInfo.readyState == 4 && patInfo.status == 200) {
			var xmlDoc = loadXMLString(patInfo.responseText);

			// Get all of the parent patientInfo nodes from the xml
			var pi_var = xmlDoc.getElementsByTagName("patientInfo");

			// Start building the patient information table
			var tableBody = ["<table>"];

			// Loop through the parent nodes to get the child nodes 
			for (var i=0, pLen=pi_var.length; i<pLen; i++){
				var pi_var2 = pi_var[i].childNodes;

				tableBody.push(
					"<tr>",
						"<td class='col1'>",pi_var2[0].text,"</td>",
						"<td class='col2' title=\"",pi_var2[2].text,"\">",pi_var2[1].text,"</td>",
					"</tr>");
			}

			// Close the table
			tableBody.push("</table>");

			// Insert the table into the patient information section
			document.getElementById('patientInfoTable').innerHTML  = tableBody.join("");
			
			var link = tabLink("Custom Patient Information","Patient Information","$APP_APPNAME$");

			// Insert the link into the patient information section header
			document.getElementById('patHeader').innerHTML  = link;
			//Initialize the col2 elements as hovers
			$.reInitPopUps('patientInfoTable');


		};   //if
	} //function

	//  Call the ccl progam and send the parameter string
	patInfo.open('GET', "ZZZ_MPAGE_PATIENTINFO");
	//patInfo.send("MINE, $PAT_Personid$"); 
	patInfo.send("MINE, "+MPAGE_REC.PERSON_ID);
	//patInfo.send("MINE,1416145.00"); 

	return;
}
/*
function allergyInfoTable(){
	// Initialize the request object
	var algyInfo = new XMLCclRequest();
	var mod_i = 0;
   	var OddRow = "";

	// Get the response
	algyInfo.onreadystatechange = function () {
		if (algyInfo.readyState == 4 && algyInfo.status == 200) {
			var xmlDoc = loadXMLString(algyInfo.responseText);

			// Get all of the parent allergy nodes from the xml
			var all_var = xmlDoc.getElementsByTagName("allergy");

			// Start building the allergy table
			var tableBody = ["<table>"];
			// Loop through the parent nodes to get the child nodes 
			for (var i=0, aLen=all_var.length;i<aLen;i++){
				mod_i = i%2;
				OddRow = "";
				if (mod_i)
					OddRow = " class='odd_row'";

				var all_var2 = all_var[i].childNodes;

				tableBody.push(
					"<tr",OddRow,">",
						"<td class='col1'>",all_var2[0].text,"</td>",
						"<td class='col2'>",all_var2[1].text,"</td>",
					"</tr>");
			}

			// Close the table
			tableBody.push("</table>");

			// Insert the table into the allergy section
			document.getElementById('allergyTable').innerHTML  = tableBody.join("");
		};   //if
	} //function

	//  Call the ccl program and send the parameter string
	algyInfo.open('GET', "ZZZ_MPAGE_ALLERGIES");
	algyInfo.send("MINE, "+MPAGE_REC.PERSON_ID+"");
	//algyInfo.send("MINE,1416145.00"); 

	return;
}
*/
function allergyInfoTable(){
	// Initialize the request object
	var allInfo = new XMLCclRequest();

	// Get the response
	allInfo.onreadystatechange = function () {
		if (allInfo.readyState == 4 && allInfo.status == 200) {
			var msgAllergy = allInfo.responseText;

			if (msgAllergy != undefined && msgAllergy != null && msgAllergy > " ") {
				var jsonAllergy = eval('(' + msgAllergy + ')');
			}

			if (jsonAllergy){
				var tableBody = ["<table>"];
				for (var i=0,aLen=jsonAllergy.ALLERGIES.ALLERGY.length;i<aLen;i++) {
					var allergyObj = jsonAllergy.ALLERGIES.ALLERGY[i]; 

					tableBody.push(    
					"<tr class='allergyRow'>",
						"<td class='col1'>", allergyObj.ALLERGY_NAME,"</td>",
						"<td class='col2'>", allergyObj.ALLERGY_REACTION,"</td>",
					"</tr>");
				}  // end for

				// Close the table
				tableBody.push("</table>");

				// Insert the table into the allergy section
				document.getElementById('allergyTable').innerHTML  = tableBody.join("")

				//  This will do alternate row shading with jquery
				$('tr.allergyRow:odd').addClass('odd_row');
			} //if (jsonAllergy)
		};   //if
	} //function

	//  Call the ccl progam and send the parameter string
	allInfo.open('GET', "ZZZ_MPAGE_ALLERGIES_JSON");
	//allInfo.send("MINE, $PAT_Personid$"); 
	allInfo.send("MINE, "+MPAGE_REC.PERSON_ID);

	return;
}


function docTable(){
	// Initialize the request object
	var docInfo = new XMLCclRequest();

	// Get the response
	docInfo.onreadystatechange = function () {
		if (docInfo.readyState == 4 && docInfo.status == 200) {
			var xmlDoc = loadXMLString(docInfo.responseText);

			// Get all of the parent patientInfo nodes from the xml
			var doc_var = xmlDoc.getElementsByTagName("documents");

			// Start building the patient information table
			var tableBody = [
				"<table>", 
				"<thead>",
				"<tr>",
					"<td class='diagnosticsCol1Hdr'>&nbsp;</td>",
					"<td class='diagnosticsCol3Hdr'>Date/Time</td>",
				"</tr>",
				"</thead>",
				"<tbody>"];


			// Loop through the parent nodes to get the child nodes 
			for (var i=0, dLen=doc_var.length;i<dLen;i++){
				var doc_var2 = doc_var[i].childNodes;

				var paramStr = "^MINE^,"+doc_var2[2].text;

				tableBody.push(
					"<tr>",
						"<td class='diagnosticsCol1'>",doc_var2[1].text,"</td>",
						"<td class='diagnosticsCol2'><a href=\"javascript:CCLLINK( 'mp_rtf_view', '"+paramStr+"', 0)\";>",doc_var2[0].text,"</a></td>",
					"</tr>");
			}

			// Close the table
			tableBody.push("</tbody></table>");

			// Insert the table into the patient information section
			document.getElementById('documentTable').innerHTML  = tableBody.join("");
		};   //if
	} //function

	//  Call the ccl progam and send the parameter string
	docInfo.open('GET', "ZZZ_MPAGE_DOCUMENTS");
	//docInfo.send("MINE, $PAT_Personid$, $VIS_Encntrid$");
	docInfo.send("MINE, "+MPAGE_REC.PERSON_ID+", "+MPAGE_REC.ENCNTR_ID);

	return;
}


function tabLink (desc,firstTab,appl) {
	var nMode = 0;
	var vcAppName = appl;
	var vcDescription = desc;
	var vcParams = "/PERSONID=$PAT_Personid$ /ENCNTRID=$VIS_Encntrid$ /FIRSTTAB="+firstTab;
	return ["<a title='Click to go to ",firstTab," Tab' href='javascript:APPLINK(",nMode,",\"",vcAppName,"\",\"",vcParams,"\");'>",vcDescription,"</a>"].join("");
}

function addAllergy() {
	var paramString =  "$PAT_Personid$|$VIS_Encntrid$|0|0|||0||0|0";
	MPAGES_EVENT("Allergy", paramString);
	allergyInfoTable();
} //end addAllergy
