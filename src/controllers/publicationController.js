import { publicationRepository } from "../repositories/publicationRepository.js";


function getHashTagFromText(tagString) {
  let tagListArray = [];
  let regexp = new RegExp('#([^\\s]*)', 'g');
  let tmplist = tagString.match(regexp);
  for (let w in tmplist) {
    let hashSub = tmplist[w].replace(/[.,\!$%\^&\*;:{}=\-_`~()]/g, "").split('#');
    for (let x in hashSub) {
      if (hashSub[x] != "") {
        if (hashSub[x].substr(hashSub[x].length - 1) == ":") {
          hashSub[x] = hashSub[x].slice(0, -1);
        }
        if (hashSub[x] != "") {
          tagListArray.push(hashSub[x]);
        }
      }
    }
  }
  return tagListArray;
}

export async function postPublication(req, res) {

  const { text, link, userId } = req.body

  const hashtagList = getHashTagFromText(text)

  try {

    await publicationRepository.postPublication(text, link, userId)

    if (hashtagList.length === 0) {
      return res.sendStatus(201);
    }

    const hashtagIdArray = await publicationRepository.returnHashtagIdArray(hashtagList)

    const postId = await publicationRepository.getPublicationId(link, userId)

    await publicationRepository.insertIntoHashtagPost(hashtagIdArray, postId)

    return res.sendStatus(201)

  } catch (error) {

    console.log(error);

    return res.sendStatus(500);
  }


}