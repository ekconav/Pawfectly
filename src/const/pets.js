const data = [
    {
      pet: 'cats',
      pets: [
        {
          id: '10',
          name: 'Lily',
          image: require('../components/cat1.png'),
          type: 'Chausie',
          age: '5 years old',
        },
        {
          id: '22',
          name: 'Lucy',
          image: require('../components/cat2.png'),
          type: 'Bobtail',
          age: '2 years old',
        },
        {
          id: '44',
          name: 'Waer',
          image: require('../components/cat3.png'),
          type: 'Bobtail',
          age: '3 yeards old'
        }
    
      ],
    },
    {
      pet: 'dogs',
      pets: [
        {
          id: '',
          name: 'Bally',
          image: require('../components/dog1.jpg'),
          type: 'German Shepherd',
          age: '2 years old',
        },
        {
          id: '2',
          name: 'Max',
          image: require('../components/dog2.jpg'),
          type: 'Foxhound',
          age: '2 years old',
        },
      ],
    },
  
];

export default data;