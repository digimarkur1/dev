**Introduction**

Your project currently has **authentication (JWT + refresh token)** but **no RBAC implementation yet**.
RBAC requires **3 structural changes**:

1. Role must exist in **User Model**
2. Role must be embedded in **JWT payload**
3. Role middleware must protect **routes**

Now I will guide **exactly file-wise where to modify and what to add.**

---

# ✅ Step-1 Update User Model (VERY FIRST)

📁 `Models/usermodel.js`

Add role column.

```js
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    id: { type: Number, required: true, unique: true },
    password: { type: String, required: true },

    role: {
        type: String,
        enum: ["admin","manager","user"],
        required: true
    }
});
```

---

# ✅ Step-2 Update Signup Controller

📁 `Controllers/usercontroller.js`

Inside signup API add role from request.

```js
const user = new User({
    name: req.body.name,
    id: req.body.id,
    password: hashpassword,
    role: req.body.role
});
```

Now DB will store role.

---

# ✅ Step-3 Fix Login Controller (MOST IMPORTANT RBAC STEP)

Your current login payload:

```js
const payload = { name: req.body.name };
```

❌ This is wrong for RBAC.

Replace with:

```js
const payload = {
   name: user.name,
   role: user.role
};
```

Now JWT contains role.

---

# ✅ Step-4 Fix Refresh Token API

📁 same controller → `getToken`

Change:

```js
generateaccesstoken({ name: payload.name });
```

To:

```js
generateaccesstoken({
   name: payload.name,
   role: payload.role
});
```

Also when finding token:

Better:

```js
.findOne({ username: payload.name })
```

(OK for now — role check optional)

---

# ✅ Step-5 Update RefreshToken Model (Recommended)

📁 `Models/refreshtoken.js`

Add role field.

```js
role : {
   type : String,
   required : true
}
```

And store role during login:

```js
await refreshtokens.create({
   token: hashrefreshtoken,
   username: payload.name,
   role: payload.role
});
```

---

# ✅ Step-6 Create NEW RBAC Middleware (New File)

📁 `Middleware/authorizeRole.js`

```js
function authorizeRole(...allowedRoles){

   return (req,res,next)=>{

      if(!allowedRoles.includes(req.user.role)){
         return res.status(403).json({
            message : "Forbidden - Role not allowed"
         });
      }

      next();
   }
}

module.exports = authorizeRole;
```

---

# ✅ Step-7 Integrate RBAC in Routes (REAL IMPLEMENTATION)

📁 `Routes/userroutes.js`

Add import:

```js
const authorizeRole = require('../Middleware/authorizeRole');
```

---

### 🔴 Only Admin Can Delete User

Change:

```js
Router.delete('/user/:id', authToken, Usercontroller.deleteuser)
```

To:

```js
Router.delete(
   '/user/:id',
   authToken,
   authorizeRole("admin"),
   Usercontroller.deleteuser
)
```

---

### 🟡 Admin + Manager Can View All Users

Change:

```js
Router.get('/users', authToken, Usercontroller.getuser)
```

To:

```js
Router.get(
   '/users',
   authToken,
   authorizeRole("admin","manager"),
   Usercontroller.getuser
)
```

---

### 🟢 All Roles Can View Single User

```js
Router.get(
   '/user/:id',
   authToken,
   authorizeRole("admin","manager","user"),
   Usercontroller.getuserid
)
```

---

# Real Runtime Story

DB:

```
San → role = user
Rocky → role = admin
```

### Case-1 San calls DELETE API

Flow:

* Auth middleware → token valid
* Role middleware → allowedRoles = ["admin"]
* San role = user
* Response → **403 Forbidden**

### Case-2 Rocky calls DELETE API

Flow:

* Auth → success
* Role → success
* Controller → delete executed

---

# Important Small Bug You Must Fix

Logout API:

```js
await refreshtokens.deleteMany({ name: req.body.name })
```

❌ Wrong field.

Correct:

```js
await refreshtokens.deleteMany({ username: req.body.name })
```

---

# Conclusion

To complete RBAC in your project you must:

* Add role column in user schema
* Embed role inside JWT payload
* Store role in refresh token collection
* Create role middleware
* Protect routes using role middleware

After this your backend becomes **proper RBAC secured system.**

If you want next step, I can guide:

👉 **How to test RBAC completely in Swagger / Postman step-by-step.**
