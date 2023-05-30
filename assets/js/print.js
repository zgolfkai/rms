$(document).ready(function() {

    window.addEventListener('message', (event) => {
        console.log(event);
        populate(event.data);
        $("#registrant").val(event.data.persons.registrant.firstName + " " + event.data.persons.registrant.firstName);
    });
});

function populate(data){
    $("#registrant").html(data.persons.registrant.firstName.toUpperCase() + " " + data.persons.registrant.lastName.toUpperCase());    
    $("#dateReg").html(": "+data.details.month+"/"+data.details.day+"/"+data.details.year);
    $("#typeTitle").html(data.details.transType.toUpperCase());
    $("#typeDetail").html(data.details.transType);
    $("#father").html(": "+data.persons.father.firstName + " " + data.persons.father.lastName);
    $("#mother").html(": "+data.persons.mother.firstName + " " + data.persons.mother.lastName);
    $("#godfather").html(": "+data.persons.godfather.firstName + " " + data.persons.godfather.lastName);
    $("#godmother").html(": "+data.persons.godmother.firstName + " " + data.persons.godmother.lastName);
    $("#officiant").html(": "+data.persons.officiant.firstName + " " + data.persons.officiant.lastName);
    var element = document.getElementById('bodyTag');
    var opt = {
    margin:       0,
    filename:     'myfile.pdf',
    image:        { type: 'jpeg', quality: 0.98 },
    html2canvas:  { scale: 1 },
    jsPDF:        { unit: 'in', format: 'a4', orientation: 'portrait' }
    };
    
    
    html2pdf().set(opt).from(element).toPdf().save().then(function(){
        window.close();
    });
    
}