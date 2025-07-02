// src/utils/mockData.js
import { faker } from '@faker-js/faker';

// 生成模拟用户数据
export const generateUsers = (count) => {
  const users = [];
  
  for (let i = 0; i < count; i++) {
    const gender = faker.person.sexType();
    const firstName = faker.person.firstName(gender);
    const lastName = faker.person.lastName();
    
    users.push({
      id: faker.string.uuid(),
      username: faker.internet.userName({ firstName, lastName }),
      email: faker.internet.email({ firstName, lastName }),
      role: faker.datatype.boolean(0.2) ? 'admin' : 'user',
      status: faker.datatype.boolean(0.8) ? 'active' : 'inactive',
      createdAt: faker.date.past({ years: 2 }).toISOString().split('T')[0],
    });
  }
  
  return users;
};