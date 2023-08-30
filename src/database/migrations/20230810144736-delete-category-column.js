'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
   await queryInterface.removeColumn('products','category');
     
  },

  async down (queryInterface, sequelize) {
     await queryInterface.addColumn('products',{
      category:{
        type:sequelize.STRING,
        allowNull:false
      }
     });
     
  }
};
