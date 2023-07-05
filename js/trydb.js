var db=openDatabase("tryDB","1.0","tryDB",65535); // tryDB is the database name

$(function(){

    loadData(); //function loading records

    //create table

    $(function() { 
        db.transaction(function(transaction) {
            var sql = "CREATE TABLE IF NOT EXISTS items " +
                "(id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, " +
                "name VARCHAR(50) NOT NULL, " +
                "birthdate VARCHAR(50) NOT NULL, " +
                "tin INT(20) NOT NULL, " +
                "type VARCHAR(50) NOT NULL)";
            transaction.executeSql(sql, undefined, function() {
                //alert("Table is created successfully");
            }, function() {
                alert("Table creation failed or already exists");
            });
        });
    });
  
    //insert into table

    $("#insert").click(function(){
        var emp=$("#employee").val();
        var bd=$("#birthdate").val();
        var date = new Date(bd);
        var tin=$("#tin").val();
        var etype=$("#etype").val(); 
        if(emp !== ""  && !isNaN(date) && !isNaN(tin) && (etype.toLowerCase() === "contractual" || etype.toLowerCase() === "regular")){
            db.transaction(function(transaction){
                var sql="INSERT INTO items(name,birthdate,tin,type) VALUES(?,?,?,?)";
                transaction.executeSql(sql,[emp,bd,tin,etype],function(){
                    alert("New item is added successfully");
                    window.open("index.html", "_self");
                    loadData();
                },function(transaction,err){
                    alert(err.message);
                });
            });
        } else{
            alert("Insert unsuccessful, please input all fields correctly");
        }   
    });

    //loadData function start

    function loadData(){
        $("#itemlist").children().remove();
        $("#itemlist").append('<tr><td>Full Name</td><td>Birthdate</td><td>TIN</td><td>Type</td><td>Action</td></tr>');
        db.transaction(function(transaction){
            var sql="SELECT * FROM items";
            transaction.executeSql(sql,undefined,function(transaction,result){
                if(result.rows.length){
                    for(var i=0;i<result.rows.length;i++){
                        var row=result.rows.item(i);
                        var id=row.id;
                        var name=row.name;
                        var birthdate=row.birthdate;
                        var tin=row.tin;
                        var type=row.type;
                        $("#itemlist").append('<tr id="del'+id+'"><td id="newname'+id+'">'+name+'</td><td id="newbd'+id+'">'+birthdate+'</td><td id="newtin'+id+'">'+tin+'</td><td id="newtype'+id+'">'+type+'</td><td><a href="#" class="btn btn-delete deleteitem" data-id="'+id+'">Delete</a> <a href="#" class="btn btn-calc calculateitem" data-id="'+id+'">Calculate</a> <a href="#" class="btn btn-update updateitem" data-id="'+id+'">Update</a></td></tr>');
                    }
                } else{
                    $("#itemlist").append('<tr><td colspan="5" align="center">No Item Found</td></tr>');
                }
            },function(transaction,err){
                //alert('No table found.');
            })
        });

    //wait time after fetching records

        setTimeout(function(){

            // delete record entry

            $(".deleteitem").click(function(){
                var id=$(this).data("id");
                db.transaction(function(transaction){
                    var sql="DELETE FROM items where id=?";
                    transaction.executeSql(sql,[id],function(){
                        //$("#del"+id).fadeOut();
                        alert("Item is deleted successfully");
                        loadData();
                    });
                });
            });

            // update entry record

            $(".updateitem").click(function(){
                var name=prompt("Kindly enter new name","");
                var birthdate=prompt('Kindly enter new birthdate',"");
                var date = new Date(birthdate);
                var tin=prompt("Kindly enter new TIN","");
                var type=prompt("Kindly enter new employee type","");
                if(name !== ""  && !isNaN(date) && !isNaN(tin) && (type.toLowerCase() === "contractual" || type.toLowerCase() === "regular")){
                    var id=$(this).data("id");
                    db.transaction(function(transaction){
                        var sql="UPDATE items SET name=?,birthdate=?,tin=?,type=? where id=?";
                        transaction.executeSql(sql,[name,birthdate,tin,type,id],function(){
                            // $("#newname"+id).html(name);
                            // $("#newbd"+id).html(birthdate);
                            // $("#newtin"+id).html(tin);
                            // $("#newtype"+id).html(type);
                            alert("Updated successfully");
                            loadData();
                        },function(transaction,err){
                            alert(err.message);
                        })
                    });
                } else{
                    alert("Update unsuccessful, please input all fields correctly");
                }
            });

            // calculate for salary

            $(".calculateitem").click(function(){
                var id = $(this).data("id");
                db.transaction(function(transaction) {
                    var sql = "SELECT type FROM items WHERE id = ?";
                    transaction.executeSql(sql, [id], function(transaction, result) {
                        var row = result.rows.item(0);
                        var type = row.type;
                        if (type.toLowerCase() === "contractual") {
                            window.open("calcu_cont.html", "_blank");
                        } else if (type.toLowerCase() === "regular") {
                            window.open("calcu_full.html", "_blank");
                        }
                    });
                });
            });

        },1000);

    }

    //loadData() function end

});

