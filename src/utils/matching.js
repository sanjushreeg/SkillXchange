export function getMatchScore(student, skills) {
  const teach = skills.filter((skill) => skill.type === 'teach').map((skill) => skill.name.toLowerCase())
  const learn = skills.filter((skill) => skill.type === 'learn').map((skill) => skill.name.toLowerCase())
  const studentTeaches = student.teaches.map((skill) => skill.toLowerCase())
  const studentWants = student.wants.map((skill) => skill.toLowerCase())
  const complementary = learn.filter((skill) => studentTeaches.includes(skill)).length
    + teach.filter((skill) => studentWants.includes(skill)).length
  const possible = learn.length + teach.length
  return possible ? Math.round((complementary / possible) * 100) : 0
}

export function findComplementarySkill(student, skills) {
  const learned = skills.find((skill) => skill.type === 'learn' && student.teaches.some((offered) => offered.toLowerCase() === skill.name.toLowerCase()))
  if (learned) return { requested: learned.name, offered: student.wants.find((wanted) => skills.some((skill) => skill.name.toLowerCase() === wanted.toLowerCase() && skill.type === 'teach')) || skills.find((skill) => skill.type === 'teach')?.name }
  const taught = skills.find((skill) => skill.type === 'teach' && student.wants.some((wanted) => wanted.toLowerCase() === skill.name.toLowerCase()))
  if (taught) return { requested: taught.name, offered: student.wants[0] || skills.find((skill) => skill.type === 'teach')?.name }
  return { requested: student.teaches[0], offered: skills.find((skill) => skill.type === 'teach')?.name }
}