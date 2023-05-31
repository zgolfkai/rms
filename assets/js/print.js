$(document).ready(function() {

    window.addEventListener('message', (event) => {
        console.log(event);
        populate(event.data);
        $("#registrant").val(event.data.persons.registrant.firstName + " " + event.data.persons.registrant.firstName);
    });
});

function populate(data){
    $("#registrant").html(data.persons.registrant.firstName.toUpperCase() + " " + data.persons.registrant.lastName.toUpperCase());    
    $("#dateReg").html(": "+data.details.day+"-"+getMonth(data.details.month)+"-"+data.details.year);
    $("#typeTitle").html(data.details.transType.toUpperCase());
    $("#typeDetail").html(data.details.transType);
    $("#certifyType").html(data.details.transType);
    $("#father").html(": "+data.persons.father.firstName + " " + data.persons.father.lastName);
    $("#mother").html(": "+data.persons.mother.firstName + " " + data.persons.mother.lastName);
    $("#godfather").html(": "+data.persons.godfather.firstName + " " + data.persons.godfather.lastName);
    $("#godmother").html(": "+data.persons.godmother.firstName + " " + data.persons.godmother.lastName);
    $("#officiant").html(": "+data.persons.officiant.firstName + " " + data.persons.officiant.lastName);
    $("#book").html(": "+data.details.book);
    $("#page").html(": "+data.details.page);
    $("#line").html(": "+data.details.line);
    $("#dateIssue").html(": "+data.details.dateIssued);
    $("#purpose").html(": "+data.details.purpose);
    $("#priest").html(data.details.priest);
    $("#title").html(data.details.title);
    var element = document.getElementById('bodyTag');
    var opt = {
        margin:       0,
        filename:     'myfile.pdf',
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { scale: 1 },
        jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
    };
    
    
    html2pdf().set(opt).from(element).toPdf().save().then(function(){
        //window.close();
    });
    
}

function getMonth(month){
    switch(month){
        case 1: return 'JAN';
        case 2: return 'FEB';
        case 3: return 'MAR';
        case 4: return 'APR';
        case 5: return 'MAY';
        case 6: return 'JUN';
        case 7: return 'JUL';
        case 8: return 'AUG';
        case 9: return 'SEP';
        case 10: return 'OCT';
        case 11: return 'NOV';
        case 12: return 'DEC';
    }
}