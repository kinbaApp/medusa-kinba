export default {
  name: 'creator',
  title: 'Creator',
  type: 'document',
  fields: [
    {
      name: 'userName',
      title: 'UserName',
      type: 'string',
    },
    {
      name: 'displayName',
      title: 'DisplayName',
      type: 'string',
    },
    {
      name: 'address',
      title: 'Address',
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
      name: 'banner',
      title: 'Banner',
      type: 'image',
      options: {
        hotspot: true,
      },
    },
    {
      name: 'fans',
      title: 'Fans',
      type: 'array',
      of: [{type: 'string'}],
    },
  ],
}
