import PushBlog from "@/components/components/ManageBlog/PushBlog";

const page = ({params}) => {
    return (
        <div>
            <h1>Push Blog</h1>
            <PushBlog blogId={params.blogId}/>
        </div>
    );
}

export default page;