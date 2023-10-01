import Configuration from "../models/Configuration.js";

export default async function (fastify) {
  await fastify.get("/api/customer", async () => {
    const customer = await Configuration.findOne({
      where: { key: "customer" },
    });

    if (customer === null) {
      console.log("no customer");
    } else {
      return customer;
    }
  });

  await fastify.patch("/api/customer", async (request) => {
    const key = "customer";
    const [customer] = await Configuration.findOrCreate({
      where: { key },
      defaults: { value: {} },
    });
    return await Configuration.update(
      { value: { ...customer.dataValues.value, ...request.body } },
      { where: { key } }
    );
  });
}
