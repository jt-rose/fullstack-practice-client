import Layout from '../components/Layout'
import { useState, useEffect, Dispatch, SetStateAction, FormEvent } from "react"

const JSONHeader = { "Content-Type": "application/json"}

const ServerCall = () => {
  const [isLoading, setLoading] = useState(true)
  const [message, setMessage] = useState("")
  useEffect(() => {
    fetch("http://localhost:5000/hellonode")
    .then(res => res.json())
    .then((res) => {
      setLoading(false)
      setMessage(res.text)
    },
    (err) => {
      setLoading(false)
      setMessage(`${err}`)
    })
  }, [])

  if (isLoading) {
    return (
      <p>Loading...</p>
    )
  } else {
    return (
      <p>{message}</p>
    )
  }
}

interface Monster {
  _id: string;
  name: string;
  location: string;
  hobbies: string;
}

const MonsterForm = (props: {dbType: ("mongo" | "postgres"), setMonsterData: Dispatch<SetStateAction<Monster[]>>}) => {
  const [name, setName] = useState("")
  const [location, setLocation] = useState("")
  const [hobbies, setHobbies] = useState("")

  const submitMonster = (event: FormEvent) => {
    event.preventDefault()
    const body = JSON.stringify({ name, location, hobbies })
    fetch(`http://localhost:5000/${props.dbType}/api/add`,
    {
      method: "post",
      body,
      headers: JSONHeader
    })
    .then(res => res.json())
    .then((res) => {
      setName("")
      setLocation("")
      setHobbies("")
      props.setMonsterData(res)
    }, (err) => {
      console.log(err.message)
    })
  }

  return (
    <form onSubmit={submitMonster}>
      <label>Name:</label>
      <input  value={name} onChange={(event) => setName(event.target.value)}></input>
      <label>Location:</label>
      <input value={location} onChange={(event) => setLocation(event.target.value)}></input>
      <label>Hobbies:</label>
      <input value={hobbies} onChange={(event) => setHobbies(event.target.value)}></input>
      <input type="submit" value="Add" disabled={[name, location, hobbies].some(input => input === "")}/>
    </form>
  )
}

const TableRow = (props: {dbType: ("mongo" | "postgres"), monster: Monster, setMonsterData: Dispatch<SetStateAction<Monster[]>>}) => {
  const { dbType, monster, setMonsterData } = props
  const [isEditing, setEditing] = useState(false)
  const [editableName, setEditableName] = useState(monster.name)
  const [editableLocation, setEditableLocation] = useState(monster.location)
  const [editableHobbies, setEditableHobbies] = useState(monster.hobbies)

  const editMonster = () => {
    const body = JSON.stringify({
      monsterID: monster._id,
      name: editableName,
      location: editableLocation,
      hobbies: editableHobbies
    })

    fetch(`http://localhost:5000/${dbType}/api/edit`,
    {
      method: "put",
      body,
      headers: JSONHeader
    })
    .then(res => res.json())
    .then(res => {
      setEditing(false)
      setMonsterData(res)
    },
    (err) => console.error(err))
  }

  const cancelEdit = () => {
    setEditing(false)
    setEditableName(monster.name)
    setEditableLocation(monster.location)
    setEditableHobbies(monster.hobbies)
  }

  const removeMonster = () => {
    const body = JSON.stringify({
      monsterID: monster._id
    })
    fetch(`http://localhost:5000/${dbType}/api/remove`, {
      method: "delete",
      body,
      headers: JSONHeader
    } )
    .then(res => res.json())
    .then((res) => {
      setMonsterData(res)
    }, (err) => {
      console.log(err.message)
    })
  }

    if (isEditing) {
      return (
        <tr>
        <td>
          <input  value={editableName} onChange={(event) => setEditableName(event.target.value)}></input>
        </td>
        <td>
          <input value={editableLocation} onChange={(event) => setEditableLocation(event.target.value)}></input>
        </td>
        <td>
          <input value={editableHobbies} onChange={(event) => setEditableHobbies(event.target.value)}></input>
        </td>
      
        <td>
          <button 
            onClick={editMonster}
            disabled={
              [
                editableName, 
                editableLocation, 
                editableHobbies]
                .some(field => field === "")
                }>Update</button>
        </td>
        <td>
          <button onClick={cancelEdit}>Cancel</button>
        </td>
      </tr>
      )
    } else {
      return (
        <tr>
            <td>{monster.name}</td>
            <td>{monster.location}</td>
            <td>{monster.hobbies}</td>
            <td>
              <button onClick={() => setEditing(true)}>Edit</button>
            </td>
            <td>
              <button onClick={removeMonster}>Delete</button>
            </td>
          </tr>
      )
    }
  }

const ServerDataTable = (props: {dbType: ("mongo" | "postgres")}) => {
  const [isLoading, setLoading] = useState(true)
  const [monsterData, setMonsterData] = useState<Monster[]>([])
  const [error, setError] = useState(null)

  useEffect(() => {
    fetch(`http://localhost:5000/${props.dbType}/api/monsterData`)
    .then(res => res.json())
    .then((res) => {
      setLoading(false)
      setMonsterData(res)
    },
    (err) => {
      setLoading(false)
      setError(err.message)
    })
  }, [])

  if (isLoading) {
    return (
      <p>Loading...</p>
    )
  } else if (error) {
    return (
      <p>{error}</p>
    )
  } else {
    return (
      <div>
      <h3>Monsters at the Mash</h3>
      <table>
        <thead>
        <tr>
          <th>name</th>
          <th>location</th>
          <th>hobbies</th>
        </tr>
        </thead>
        <tbody>
        {monsterData.map( (monster, i) => (
          <TableRow 
            dbType={props.dbType}
            monster={monster} 
            setMonsterData={setMonsterData}
            key={`${monster}-${i}`}  
          />
        ))}
        </tbody>
      </table>
      <MonsterForm dbType={props.dbType} setMonsterData={setMonsterData} />
      </div>
    )
  }
}

const IndexPage = () => (
  <Layout title="Home | Next.js + TypeScript Example">
    <h1>Full-Stack React 👋</h1>
    <p>
      Let's practice connecting React to a backend! In this simple project, we'll build the following:
    </p>
    <ol>
      {[
        "Set up react client with async call to server",
        "Set up server with Mock DB / API response to client",
        "Add CRUD calls to server from client",
        "Refactor Mock DB to use Mongo/ Mongoose",
        "Rebuild DB using Postgres",
        "Integrate GraphQL/ Apollo",
        "Manage Cookies/ session ID",
        "Set up user login/ auth",
      ].map((task, i) => (<li key={`task-${i}`}>{task}</li>))}
    </ol>
    <p>Let's try connecting to the server:</p>
    <ServerCall />
      <p>Great! Our basic API call went through. Now, let's try to import data for a table:</p>
      <ServerDataTable dbType="mongo"/>
      <br />
      <p>Success! The basic MERN stack is up and running.</p>
      <p>After testing out mongoose a bit, I decided to forego using it. 
        TypeScript/ validator functions easily handle modeling object shape already
        and the other benefits didn't seem worth it.
      </p>
      <br />
      <p>Now, onto testing out Postgres!</p>
      <p>First, let's just make a basic connection and grab our monsters:</p>
      <ServerDataTable dbType="postgres" />
      <p>Postgres is up and running! It is interesting to compare the two, with Mongo being easier to set up
        and more 'node-like', but Postgres seeming more capable and perhaps a little faster. I opted to use postgres-node
        rather than sequalize because I still want to get practice wriing standard SQL queries. In the future,
        I might look into using sequalize as it seems it would speed things up and help avoid some dumb errors like typos.
      </p>
  </Layout>
)

export default IndexPage
