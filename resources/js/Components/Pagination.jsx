import { Link } from "@inertiajs/react"

function Pagination({links}) {
    return (
        
        <nav className="text-center mt-4"> 
            {links.map((link) => (
                
                <Link key={link.label} href={link.url ||""}
                className={"inline-block px-3 py-2 mx-1 rounded-lg" + (link.active ? 'bg-gray-9500' : '') + (!link.url ?"text-gray-400 cursor-not-allowed" : "hover:bg-gray-950")}
                 dangerouslySetInnerHTML={{__html:link.label}}></Link>
            ))}
        </nav>
    )
}

export default Pagination
