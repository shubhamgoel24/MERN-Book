{
    //method to submit comment form using ajax
    let createComment = function(){
        let newCommentForm = $('#new-comment-form');
        newCommentForm.submit(function(e){
            e.preventDefault();
            $.ajax({
                type: 'post',
                url: '/comments/create',
                data: newCommentForm.serialize(),
                success: function(data){
                    let newComment = newCommentDom(data.data.comment);
                    $(`#post-comments-${data.data.comment.post}`).prepend(newComment);
                    deleteComment($(' .delete-comment-button',newComment));
                },error: function(error){
                    console.log(error.responseText);
                }
            });
            $('#commentData').val('');
        });
    }

    //method to create comment in dom
    let newCommentDom = function(comment){
        return $(`<li id="comment-${comment._id}">
                    <small>
                            <a  class="delete-comment-button" href="/comments/destroy/${comment._id}">X</a>
                    </small>        
                    <p>
                    ${comment.content}
                    <br>
                    <small>
                        ${comment.user.name}
                    </small>
                    </p>
                </li>`);
    }

    //method to delete comment
    let deleteComment = function(deleteLink){
        $(deleteLink).click(function(e){
            e.preventDefault();

            $.ajax({
                type: 'get',
                url: $(deleteLink).prop('href'),
                success: function(data){
                    $(`#comment-${data.data.comment_id}`).remove();
                },error: function(error){
                    console.log(error.responseText);
                }
            });
        });
    }

    createComment();
}