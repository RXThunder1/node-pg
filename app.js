const express = require('express');
const app = express();
const companiesRoutes = require('./routes/companies');
const invoicesRoutes = require('./routes/invoices');

app.use(express.json());
app.use('/companies', companiesRoutes);
app.use('/invoices', invoicesRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});