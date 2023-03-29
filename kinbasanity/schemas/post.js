export default {
  name: 'post',
  title: 'Post',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
    },
    {
      name: 'image',
      title: 'Image',
      type: 'image',
      options: {
        hotspot: true,
      },
    },
    {
      name: 'postedBy',
      title: 'PostedBy',
      type: 'string',
    },
    {
      name: 'poster',
      title: 'Poster',
      type: 'creator',
    },
    {
      name: 'caption',
      title: 'Caption',
      type: 'string',
    },
  ],
}
