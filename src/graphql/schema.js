const { gql } = require("apollo-server-express");

const typeDefs = gql`
  type Project {
    id: ID!
    title: String!
    description: String
    technologies: String
    link: String
  }

  type Experience {
    id: ID!
    company: String!
    position: String!
    startDate: String!
    endDate: String
    description: String
  }

  type Skill {
    id: ID!
    name: String!
    level: String
  }

  type Achievement {
    id: ID!
    title: String!
    description: String
    date: String!
  }

  type Query {
    getProjects: [Project]
    getExperience: [Experience]
    getSkills: [Skill]
    getAchievements: [Achievement]
  }

  type Mutation {
    addProject(
      title: String!
      description: String
      technologies: String
      link: String
    ): Project
    addExperience(
      company: String!
      position: String!
      startDate: String!
      endDate: String
      description: String
    ): Experience
    addSkill(name: String!, level: String): Skill
    addAchievement(
      title: String!
      description: String
      date: String!
    ): Achievement
  }
`;

module.exports = typeDefs;
