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
	// Start building the patient information table
	var tableBody = ["<table>"];

	tableBody.push(
		"<tr>",
			"<td class='col1' id='blueCol'>This is Column1</td>",
			"<td class='col2'>This is Column2</td>",
		"</tr>");
	// Close the table
	tableBody.push("</table>");

	// Insert the table into the patient information section
	document.getElementById('patientInfoTable').innerHTML  = tableBody.join("");
	document.getElementById('blueCol').style.color = "#0000FF";
	
	return;
}
