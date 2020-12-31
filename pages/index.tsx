import Layout from '../components/Layout'
import { useState, useEffect, Dispatch, SetStateAction, FormEvent } from "react"

const ServerCall = () => {
  const [isLoading, setLoading] = useState(true)
  const [message, setMessage] = useState("")
  useEffect(() => {
    fetch("http://localhost:5000/hellonode")
    .then(res => res.json())
    .then((res) => {
      console.log(res)
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

const MonsterForm = (props: {setMonsterData: Dispatch<SetStateAction<Monster[]>>}) => {
  const [name, setName] = useState("")
  const [location, setLocation] = useState("")
  const [hobbies, setHobbies] = useState("")

  const submitMonster = (event: FormEvent) => {
    event.preventDefault()
    fetch(`http://localhost:5000/add?name=${name}&location=${location}&hobbies=${hobbies}`)
    .then(res => res.json())
    .then((res) => {
      console.log(res)
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

const TableRow = (props: {monster: Monster, setMonsterData: Dispatch<SetStateAction<Monster[]>>}) => {
  const { monster, setMonsterData } = props
  const [isEditing, setEditing] = useState(false)
  const [editableName, setEditableName] = useState(monster.name)
  const [editableLocation, setEditableLocation] = useState(monster.location)
  const [editableHobbies, setEditableHobbies] = useState(monster.hobbies)

  const editMonster = () => {
    const queryParams = `name=${editableName}&location=${editableLocation}&hobbies=${editableHobbies}`
    fetch(`http://localhost:5000/edit?monsterID=${monster._id}&${queryParams}`)
    .then(res => res.json())
    .then(res => {
      setEditing(false)
      console.log(res)
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
    fetch("http://localhost:5000/remove/" + monster._id)
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

const ServerDataTable = () => {
  const [isLoading, setLoading] = useState(true)
  const [monsterData, setMonsterData] = useState<Monster[]>([])
  const [error, setError] = useState(null)

  useEffect(() => {
    fetch("http://localhost:5000/monsterData")
    .then(res => res.json())
    .then((res) => {
      console.log(res)
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
            monster={monster} 
            setMonsterData={setMonsterData}
            key={`${monster}-${i}`}  
          />
        ))}
        </tbody>
      </table>
      <MonsterForm setMonsterData={setMonsterData} />
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
        "Integrate GraphQL/ Apollo",
        "Set up user login/ auth",
        "Manage Cookies/ session ID"
      ].map((task, i) => (<li key={`task-${i}`}>{task}</li>))}
    </ol>
    <p>Let's try connecting to the server:</p>
    <ServerCall />
      <p>Great! Our basic API call went through. Now, let's try to import data for a table:</p>
      <ServerDataTable />
  </Layout>
)

export default IndexPage
