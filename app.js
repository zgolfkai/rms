const path = require('path');
const chromeLauncher = require('chrome-launcher');


var express  =  require('express');
const router  =  express.Router();
var app  =  express();
app.set('view engine', 'pug');

const sqlite3 = require('sqlite3').verbose();
var db;

const hostname = '127.0.0.1';
const port = 3000;

var http = require('http').createServer(app);

http.listen(port, function(){
    console.log('server on port '+port);

    //chromeLauncher.launch({
    //    startingUrl: 'http://localhost:3000',
    //})
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/', router);

app.use('/assets',express.static(getDir()+'/assets'));
app.use('/add.html',express.static(getDir()+'/add.html'));
app.use('/search.html',express.static(getDir()+'/search.html'));
app.use('/print.html',express.static(getDir()+'/print.html'));
app.use('/assets/img/bitmap.png',express.static('getDir()+/assets/img/bitmap.png'));
app.set('views',getDir()+'/views');
router.get('/', (req,res) => { 
    res.render('index',{basedir: getDir()});
})

router.post('/register',async (req,res) => {
    data=req.body;
    var result=await addRegistration(req.body);
    
    res.json({
        ok: true,
        data: {
          message:result
        }
    });
});

router.get('/registrations',(req,res) => {
    connectDB(db);
    var sql="SELECT * FROM baptismal INNER JOIN dates on dates.regIndex = baptismal.linkIndex WHERE baptismal.userType='Registrant' ORDER BY baptismal.lastName ASC"
    db.all(sql,(err,row)=> {
        if (err) {
            throw err;
        }else{
            res.json({
                ok: true,
                data:row
                
            });
        }
    });
});

router.get('/registration/:regIndex',(req,res) => {
    connectDB(db);
    var sql="SELECT * FROM dates WHERE dates.regIndex = "+ req.params.regIndex;
    db.all(sql,(err,row)=> {
        if (err) {
            throw err;
        }else{
            sql="SELECT * FROM baptismal WHERE baptismal.linkIndex = "+ req.params.regIndex +""
            db.all(sql,(err,list)=> {
                if (err) {
                    throw err;
                }else{
                    res.json({
                        ok: true,
                        data:{
                            details:row[0],
                            persons:list
                        }
                    });
                }
            });
        }
    });
});

function connectDB(){
    db = new sqlite3.Database('./parish.db', (err) => {
        if (err) {
        console.error(err.message);
        }else{
            console.log('Connected to the parish database.');
        }
    });
}

function closeDB(db){
    db.close((err) => {
        if (err) {
        console.error(err.message);
        }else{
        console.log('Closing the database connection.');
        }
    });
}

async function duplicateCheck(data){
    connectDB(db);
    var sql2="SELECT * FROM baptismal WHERE baptismal.firstName='"+data.registrant.firstname+"' AND baptismal.lastName='"+data.registrant.lastname+"' ORDER BY linkIndex DESC LIMIT 1"
    return new Promise((resolve) => {
        db.get(sql2,(err,row)=> {
            closeDB(db);
            if(err) {
                console.log(err.message);
            }else{
                if(row==undefined){
                    resolve(0);
                }else{
                    resolve(1)
                }
            }
            
        });
    })
}

async function addRegistration(data){
    return new Promise(async (resolve) => {
        var test=await duplicateCheck(data);
        if(test==true){
            console.log("user found");
            resolve("User found.");
        }else{
            var index=0;

            connectDB(db);
            sql="INSERT INTO dates(day,month,year,birthday,birthmonth,birthyear,transType,book,page,line) VALUES (?,?,?,?,?,?,?,?,?,?)";
            insertData=[
                data.details.day,
                data.details.month,
                data.details.year,
                data.details.birthday,
                data.details.birthmonth,
                data.details.birthyear,
                data.details.type,
                data.details.book,
                data.details.page,
                data.details.line,
            ]
            db.run(sql,insertData, function(err){
                if(err) {
                    console.log(err.message);
                }else{
                    index=this.lastID
                    sql="INSERT INTO baptismal(firstName,lastName,userType,linkIndex) VALUES (?,?,?,?)";
                    insertData=[data.registrant.firstname,data.registrant.lastname,'Registrant',index]
                    db.run(sql,insertData, function(err){
                        if(err) {
                            console.log(err.message);
                        }
                    });
                    insertData=[data.father.firstname,data.father.lastname,'Father',index]
                    db.run(sql,insertData, function(err){
                        if(err) {
                            console.log(err.message);
                        }
                    });
                    insertData=[data.mother.firstname,data.mother.lastname,'Mother',index]
                    db.run(sql,insertData, function(err){
                        if(err) {
                            console.log(err.message);
                        }
                    });
                    insertData=[data.sponsor1.firstname,data.sponsor1.lastname,'Godfather',index]
                    db.run(sql,insertData, function(err){
                        if(err) {
                            console.log(err.message);
                        }
                    });
                    insertData=[data.sponsor2.firstname,data.sponsor2.lastname,'Godmother',index]
                    db.run(sql,insertData, function(err){
                        if(err) {
                            console.log(err.message);
                        }
                    });
                    insertData=[data.officiant.firstname,data.officiant.lastname,'Officiant',index]
                    db.run(sql,insertData, function(err){
                        if(err) {
                            console.log(err.message);
                        }
                    });
                    closeDB(db);
                    
                    resolve("User not found.")
                }
            });
            
        }
    });
}

function getDir() {
    return __dirname;
    if (process.pkg) {
        return path.resolve(process.execPath + "/..");
    } else {
        return path.join(require.main ? require.main.path : process.cwd());
    }
}