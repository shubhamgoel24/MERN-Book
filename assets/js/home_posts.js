{
    //method to sumbmit post form using ajax
    let createPost = function(){
        let newPostForm = $('#new-post-form');
        newPostForm.submit(function(e){
            e.preventDefault();
            $.ajax({
                type: 'post',
                url: '/posts/create',
                data: newPostForm.serialize(),
                success: function(data){
                    let newPost = newPostDom(data.data);
                    $('#posts-container>ul').prepend(newPost);
                    deletePost($(' .delete-post-button',newPost));
                },error: function(error){
                    console.log(error.responseText);
                }
            });
            $('#postdata').val('');
        });

    }

    //method to create a post in dom
    let newPostDom = function(post){
        return $(`<li id="post-${post.post._id}">
                    <p>
                        <small>
                            <a class="delete-post-button" href="/posts/destroy/${post.post._id}">X</a>
                        </small>
                        ${post.post.content}
                        <br>

                        <small>
                            ${post.user.name}
                        </small>

                        <ul id="post-comments-${post.post._id}">
                               
                        </ul>

                        <form action="/comments/create" method="POST">
                            <input type="text" name="content" placeholder="Type Comment Here..." required></input>
                            <input type="hidden" name="post" value="${post.post._id}">
                            <input type= "submit" value="Post">
                        </form>
                    </p>
                </li>`);
    }

    //method to delete post
    let deletePost = function(deleteLink){
        $(deleteLink).click(function(e){
            e.preventDefault();

            $.ajax({
                type: 'get',
                url: $(deleteLink).prop('href'),
                success: function(data){
                    $(`#post-${data.data.post_id}`).remove();
                },error: function(error){
                    console.log(error.responseText);
                }
            });
        });
    }

    createPost();
}