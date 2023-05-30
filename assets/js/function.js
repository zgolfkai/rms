
$(document).ready(function() {
    $(".container").load("search.html");
    clickSearch();
    var dataRegistration=[];
});

function resetInput(){
    console.log($("#dateRegistration").val());
    $(".inputText").val("");
}

function waitForElement(id, callback){
    var poops = setInterval(function(){
        if(document.getElementById(id)){
            clearInterval(poops);
            callback();
        }
    }, 10);
}

async function clickAdd(){
    $("#viewRegistration").dialog("close");
    $(".container").load("add.html")
    waitForElement("dateRegistration", function(){
        $("#dateRegistration").datepicker();
    });
    waitForElement("dateBirthday", function(){
        $("#dateBirthday").datepicker();
    });
}

async function getRegistration(reference){
    return new Promise(async (resolve) => {
        $.ajax({
            type:"GET",
            dataType:"json",
            contentType: "application/json",
            url:"/registration/"+reference,
        })
        .then(function(response) {
            console.log(response.data)
            data={
                details:response.data.details,
                persons:{
                    registrant:response.data.persons.filter(person=>
                        person.userType=='Registrant'
                    )[0],
                    father:response.data.persons.filter(person=>
                        person.userType=='Father'
                    )[0],
                    mother:response.data.persons.filter(person=>
                        person.userType=='Mother'
                    )[0],
                    godfather:response.data.persons.filter(person=>
                        person.userType=='Godfather'
                    )[0],
                    godmother:response.data.persons.filter(person=>
                        person.userType=='Godmother'
                    )[0],
                    officiant:response.data.persons.filter(person=>
                        person.userType=='Officiant'
                    )[0]
                }
            }
            resolve(data);
        });
    });
}
async function printRegistration(reference){
    var printWindows = window.open("print.html","Print Registration","_blank,height=1123,width=794,scrollbars=no");
    await getRegistration(reference).then(function(data){
        console.log(data);
        setTimeout(function(){
            printWindows.postMessage(data, '*');
        },1000)
    });
    
    
}

async function openRegistration(reference){
    
    var data = await getRegistration(reference)
    console.log(data);
    $("#registrant").val(data.persons.registrant.firstName +" "+data.persons.registrant.lastName);
    $("#birthday").val(data.details.birthmonth +"/"+data.details.birthday +"/"+data.details.birthyear);
    $("#regDate").val(data.details.month +"/"+data.details.day +"/"+data.details.year)
    $("#registrant").val(data.persons.registrant.firstName +" "+data.persons.registrant.lastName);
    $("#father").val(data.persons.father.firstName +" "+data.persons.father.lastName);
    $("#mother").val(data.persons.mother.firstName +" "+data.persons.mother.lastName);
    $("#sponsor1").val(data.persons.godfather.firstName +" "+data.persons.godfather.lastName);
    $("#sponsor2").val(data.persons.godmother.firstName +" "+data.persons.godmother.lastName);
    $("#officiant").val(data.persons.officiant.firstName +" "+data.persons.officiant.lastName);
    
    
    $("#viewRegistration").dialog({
        autoOpen: false,
        show: {
            effect: "blind",
            duration: 1000
        },
        hide: {
            effect: "explode",
            duration: 1000
        },
        maxWidth:300,
        width:300,
        position:{my: "right-120% top-70%", at: "menu"},
        collision:"none"
    });
    $("#viewRegistration").dialog("open");

}

function clickSearch(){
    $(".container").load("search.html");
    var availableTags=[];
    $.ajax({
        type:"GET",
        dataType:"json",
        contentType: "application/json",
        url:"/registrations",
    })
    .then(function(response) {
        dataRegistration=response.data
        response.data.forEach(function(record){
            $('.results>tbody').append("<tr><td><a href='#' onclick='openRegistration("+record.regIndex+")'>View</a> <a href='#' onclick='printRegistration("+record.regIndex+")'>Print</a></td><td>"+record.lastName+","+record.firstName+"</td>"+
            "<td>"+record.month+"/"+record.day+"/"+record.year+"</td>"+
            "<td>"+record.birthmonth+"/"+record.birthday+"/"+record.birthyear+"</td></tr>");
            availableTags.push(record.lastName+","+record.firstName);
            console.log(availableTags);
        })
        
        $('#searchRegistration').quicksearch('.results tbody tr',{
            'delay': 100,
            'bind':'keyup keydown change input',
            'onAfter': function(){
                var txtstring=$('#searchRegistration').val();
                $('#searchRegistration').val("");
                $('#searchRegistration').val(txtstring);
            }
        });
        console.log(availableTags);
        /*$("#searchRegistration").autocomplete({
            source: availableTags,
            select: function(event,ui){
                markSearch();
                $('#searchRegistration').val($('#searchRegistration').val());
            }
        });*/
    }); 
}



function searchRegistration(){
    $.ajax({
        type:"POST",
        dataType:"json",
        contentType: "application/json",
        data:JSON.stringify(data),
        url:"/register",
    })
    .then(function(response) {
        console.log(response)
        if (response.ok) {

        }
    });
}

function addRegistration(){
    var dateValues=$("#dateRegistration").val().split("/");
    var birthdateValues=$("#dateBirthday").val().split("/");
    var data={
        details:{
            day:dateValues[1],
            month:dateValues[0],
            year:dateValues[2],
            birthday:dateValues[1],
            birthmonth:dateValues[0],
            birthyear:dateValues[2],
            type:$("#typeRegistration").val(),
        },
        registrant:{
            firstname:$("#regFirstName").val(),
            lastname:$("#regLastName").val()
        },
        father:{
            firstname:$("#fatherFirstName").val(),
            lastname:$("#fatherLastName").val()
        },
        mother:{
            firstname:$("#motherFirstName").val(),
            lastname:$("#motherLastName").val()
        },
        sponsor1:{
            firstname:$("#sponsor1FirstName").val(),
            lastname:$("#sponsor1LastName").val()
        },
        sponsor2:{
            firstname:$("#sponsor2FirstName").val(),
            lastname:$("#sponsor2LastName").val()
        },
        officiant:{
            firstname:$("#officiantTitle").val() +" "+$("#officiantFirstName").val(),
            lastname:$("#officiantLastName").val()
        }
    }
    console.log(data);


    $.ajax({
        type:"POST",
        dataType:"json",
        contentType: "application/json",
        data:JSON.stringify(data),
        url:"/register",
    })
    .then(function(response) {
        console.log(response)
        if (response.ok) {
            if(response.data.message=='User found.')
                alert("User already in database.")
            else
                alert("User entered in database.")
        }
    }); 

}

function markSearch(){
    $('.results>tbody').unmark();
    var searchtext=$('#searchRegistration').val()
    $('.results>tbody').mark(searchtext);
    if($('#searchRegistration').val()==""){
        $('.results>tbody').unmark();
    }
}