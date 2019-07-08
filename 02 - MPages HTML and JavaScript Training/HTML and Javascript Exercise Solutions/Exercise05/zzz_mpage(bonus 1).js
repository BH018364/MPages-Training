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
				if (pi_var2[0].text !== "Patient Id:") {
					tableBody.push(
						"<tr>",
							"<td class='col1'>",pi_var2[0].text,"</td>",
							"<td class='col2'>",pi_var2[1].text,"</td>",
						"</tr>");
				}
			}

			// Close the table
			tableBody.push("</table>");

			// Insert the table into the patient information section
			document.getElementById('patientInfoTable').innerHTML  = tableBody.join("");
		};   //if
	} //function

	//  Call the ccl progam and send the parameter string
	patInfo.open('GET', "ZZZ_MPAGE_PATIENTINFO");
	//patInfo.send("MINE, $PAT_Personid$");
	patInfo.send("MINE,1416145.00"); 

	return;
}

