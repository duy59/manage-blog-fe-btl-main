import EditAiBlog from "@/components/components/ManageBlog/EditAiBlog";
const page = ({params}) => {
    console.log(params.blogId)
    return (
        <div>
           <EditAiBlog blogId={params.blogId}/>
        </div>
    );
}

export default page;