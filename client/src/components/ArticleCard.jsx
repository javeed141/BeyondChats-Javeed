// import { Link } from "react-router-dom"
// import { Button } from "@/components/ui/button"
// import {
//   Card,
//   CardContent,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"

// export default function ArticleCard({ article, onDelete }) {
//   return (
//     <Card className="transition hover:shadow-md">
//       <CardHeader className="space-y-1">
//         <CardTitle className="line-clamp-2">
//           {article.title}
//         </CardTitle>
//         <p className="text-sm text-muted-foreground">
//           {article.author || "Unknown author"}
//         </p>
//       </CardHeader>

//       <CardContent className="flex items-center justify-between">
//         <Badge variant={article.updatedContent ? "default" : "secondary"}>
//           {article.updatedContent ? "Updated" : "Original"}
//         </Badge>

//         <div className="flex gap-2">
//           <Link to={`/articles/${article._id}/edit`}>
//             <Button size="sm" variant="outline">Edit</Button>
//           </Link>

//           {article.url && (
//             <a href={article.url} target="_blank">
//               <Button size="sm" variant="ghost">Open</Button>
//             </a>
//           )}

//           <Button
//             size="sm"
//             variant="destructive"
//             onClick={() => onDelete(article._id)}
//           >
//             Delete
//           </Button>
//         </div>
//       </CardContent>
//     </Card>
//   )
// }
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default function ArticleCard({ article, onEdit, onDelete }) {
  return (
    <Card className="transition hover:shadow-md">
      <CardHeader>
        <CardTitle>{article.title}</CardTitle>
        <p className="text-sm text-muted-foreground">
          {article.author || "Unknown"}
        </p>
      </CardHeader>

      <CardContent className="flex justify-between items-center">
        <div className="flex gap-2">
          <Button size="sm" onClick={() => onEdit(article)}>
            Edit
          </Button>

          {article.url && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => window.open(article.url, "_blank")}
            >
              Open
            </Button>
          )}

          <Button
            size="sm"
            variant="destructive"
            onClick={() => onDelete(article._id)}
          >
            Delete
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
