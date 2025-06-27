export async function createRecord(collection, payload) {
    try {
        let response = await fetch(`${process.env.REACT_APP_BACKEND_SERVER}/api/${collection}`, {
            method: "POST",
            headers: {
                "content-type": "application/json",
                "authorization": localStorage.getItem("token")
            },
            body: JSON.stringify(payload)
        })
        return await response.json()
    } catch (error) {
        console.log(error)
    }
}

export async function createMultiPartRecord(collection, payload) {
    try {
        let response = await fetch(`${process.env.REACT_APP_BACKEND_SERVER}/api/${collection}`, {
            method: "POST",
            headers: {
                "authorization": localStorage.getItem("token")
            },
            body: payload
        })
        return await response.json()
    } catch (error) {
        console.log(error)
    }
}

export async function getRecord(collection,payload) {
    try {
        let url = `${process.env.REACT_APP_BACKEND_SERVER}/api/${collection}`
        if (collection === "cart" || collection === "wishlist")
            url = `${process.env.REACT_APP_BACKEND_SERVER}/api/${collection}/${localStorage.getItem("userid")}`
        else if ((collection === "checkout" || collection==="booking") && localStorage.getItem("role") === "Buyer")
            url = `${process.env.REACT_APP_BACKEND_SERVER}/api/${collection}/user/${localStorage.getItem("userid")}`
        else if ((collection === "checkout" || collection==="booking") && localStorage.getItem("role") === "Buyer")
            url = `${process.env.REACT_APP_BACKEND_SERVER}/api/${collection}/user/${payload._id}`

        let response = await fetch(url, {
            method: "GET",
            headers: {
                "content-type": "application/json",
                "authorization": localStorage.getItem("token")
            }
        })
        return await response.json()
    } catch (error) {
        console.log(error)
    }
}

export async function updateRecord(collection, payload) {
    try {
        let url = `${process.env.REACT_APP_BACKEND_SERVER}/api/${collection}/${payload._id}`
        if(collection === "resturent")
            url = `${process.env.REACT_APP_BACKEND_SERVER}/api/${collection}/user/${payload._id}`
        let response = await fetch(url,{
            method: "PUT",
            headers: {
                "content-type": "application/json",
                "authorization": localStorage.getItem("token")
            },
            body: JSON.stringify(payload)
        });
        return await response.json(); // Returns the response directly
    } catch (error) {
        console.log(error);
    }
}

export async function updateMultiPartRecord(collection, payload) {
    try {
        let response = await fetch(`${process.env.REACT_APP_BACKEND_SERVER}/api/${collection}/${payload.get('_id')}`, {
            method: "PUT",
            headers: {
                "authorization": localStorage.getItem("token")
            },
            body: payload
        })
        return await response.json()
    } catch (error) {
        console.log(error)
    }
}

export async function deleteRecord(collection, payload) {
    try {
        let response = await fetch(`${process.env.REACT_APP_BACKEND_SERVER}/api/${collection}/${payload._id}`, {
            method: "DELETE",
            headers: {
                "content-type": "application/json",
                "authorization": localStorage.getItem("token")
            }
        })
        return await response.json()
    } catch (error) {
        console.log(error)
    }
}