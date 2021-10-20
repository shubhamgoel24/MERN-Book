{
    let createRequest = function(){
        let newreq = $('#friendReqBut');
        newreq.click(function(e){
            e.preventDefault();
            $.ajax({
                type: 'post',
                url: newreq.prop('href'),
                success: function(data){
                    if(data.data.delete){
                        newreq.text("Add Friend");
                        newreq.attr('href', '/friend/newreq/'+data.data.id)
                    }else{
                        newreq.text("Remove Friend");
                        newreq.attr('href', '/friend/delreq/'+data.data.id)
                    }
                    new Noty({
                        theme: 'relax',
                        text: data.message,
                        type: 'success',
                        layout: 'topRight',
                        timeout: 1500
                        
                    }).show();

                }, error: function(error){
                    console.log(error.responseText);
                }
            });
        });
    }
    createRequest();
}