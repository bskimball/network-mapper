import Configuration from "../models/Configuration.js";

export default async function (fastify) {
  await fastify.get("/api/isp", async () => {
    const isp = await Configuration.findOne({ where: { key: "isp" } });

    if (isp == null) {
      console.log("no isp");
    } else {
      return isp;
    }
  });

  await fastify.get("/api/isp/:uuid", async (request) => {
    await Configuration.findOne({
      where: {
        value: {
          [Op.eq]: request.params.uuid,
        },
      },
    });
  });

  await fastify.patch("/api/isp/:uuid", async (request) => {
    const key = "isp";
    const [isp] = await Configuration.findOrCreate({
      where: { key },
      defaults: { value: {} },
    });

    const thisISP = isp.dataValues.value[request.params.uuid];
    return await Configuration.update(
      {
        value: {
          ...isp.dataValues.value,
          [request.params.uuid]: { ...thisISP, ...request.body },
        },
      },
      { where: { key } }
    );
  });

  await fastify.delete("/api/isp/:uuid", async (request) => {
    const key = "isp";
    const isp = await Configuration.findOne({
      where: { key },
    });

    delete isp.dataValues.value[request.params.uuid];

    console.log(isp);

    return await Configuration.update(
      {
        value: {
          ...isp.dataValues.value,
        },
      },
      { where: { key } }
    );
  });
}
