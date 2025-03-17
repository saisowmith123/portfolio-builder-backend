const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const resolvers = {
  Query: {
    getProjects: async (_, __, { user }) => {
      if (!user) throw new Error("Unauthorized");
      return await prisma.project.findMany({ where: { userId: user.userId } });
    },
    getExperience: async (_, __, { user }) => {
      if (!user) throw new Error("Unauthorized");
      return await prisma.experience.findMany({
        where: { userId: user.userId },
      });
    },
    getSkills: async (_, __, { user }) => {
      if (!user) throw new Error("Unauthorized");
      return await prisma.skill.findMany({ where: { userId: user.userId } });
    },
    getAchievements: async (_, __, { user }) => {
      if (!user) throw new Error("Unauthorized");
      return await prisma.achievement.findMany({
        where: { userId: user.userId },
      });
    },
  },

  Mutation: {
    addProject: async (
      _,
      { title, description, technologies, link },
      { user }
    ) => {
      if (!user) throw new Error("Unauthorized");
      return await prisma.project.create({
        data: { userId: user.userId, title, description, technologies, link },
      });
    },

    addExperience: async (
      _,
      { company, position, startDate, endDate, description },
      { user }
    ) => {
      if (!user) throw new Error("Unauthorized");
      return await prisma.experience.create({
        data: {
          userId: user.userId,
          company,
          position,
          startDate,
          endDate,
          description,
        },
      });
    },

    addSkill: async (_, { name, level }, { user }) => {
      if (!user) throw new Error("Unauthorized");
      return await prisma.skill.create({
        data: { userId: user.userId, name, level },
      });
    },

    addAchievement: async (_, { title, description, date }, { user }) => {
      if (!user) throw new Error("Unauthorized");
      return await prisma.achievement.create({
        data: { userId: user.userId, title, description, date },
      });
    },
  },
};

module.exports = resolvers;
