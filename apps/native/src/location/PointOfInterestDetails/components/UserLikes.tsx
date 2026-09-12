import { Ionicons } from "@expo/vector-icons"
import { useEffect, useState } from "react"
import { Pressable, Text } from "react-native"
export default function UserLikes(){

  const [liked,setLiked] = useState(false)
 const [addLike,setAddLike] = useState(0)

 const likes = 0
 
    const createLike = () => {
       
        setLiked(prev => !prev)
    }






    return(
        <>
        <Pressable
        onPress={
    
            createLike
        }
        ><Ionicons style={[liked && {color:'yellow'}]} name='thumbs-up-outline' color="#0088cc"/></Pressable>
      
                                        <Text>{liked ? 1+ likes : likes}</Text>
        </>
    )
}

