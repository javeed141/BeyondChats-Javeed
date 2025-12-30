
const {getJson} = require("serpapi")
require("dotenv").config();

// dotenv.config()

const apiKey= process.env.SERP_API

// console.log(apiKey)


getJson({
  api_key:apiKey,
  q:"Java Functions",
  engine:"google",

},(json)=>{
  const data= json.organic_results ; 
  data.forEach((res,index)=>{
    console.log(res.link);
  })

}

)