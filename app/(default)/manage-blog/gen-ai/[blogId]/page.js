import GenAiBlog from "@/components/components/ManageBlog/GenAiBlog";
const page = ({params}) => {
    console.log(params.blogId)
    return (
        <div>
           <GenAiBlog blogId={params.blogId}/>
        </div>
    );
}

export default page;