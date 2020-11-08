import soupsLib from '../../constants/soups-lib';

const mapamize = (lib) => {
  const map = new Map();
  lib.forEach((s) => {
    map.set(s.id, JSON.stringify(s));
  });
  return map;
};

const libs = {
  soups: mapamize(soupsLib),
};

export function get(req, res) {
  const { lib, id } = req.params;

  if (libs[lib].has(id)) {
    console.log(`sapper get ${lib} ${id} result:`, 'success');

    res.writeHead(200, {
      'Content-Type': 'application/json',
    });

    res.end(libs[lib].get(id));
  } else {
    res.writeHead(404, {
      'Content-Type': 'application/json',
    });

    res.end(
      JSON.stringify({
        error: `sapper get failed for ${lib} ${id}`,
      })
    );
  }
}
