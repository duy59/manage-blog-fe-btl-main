import ViewBlog from "@/components/components/ManageBlog/ViewBlogFb";
const page = ({params}) => {
    console.log(params.blogId)
    return (
        <div>
           <ViewBlog blogId={params.blogId}/>
        </div>
    );
}

export default page;