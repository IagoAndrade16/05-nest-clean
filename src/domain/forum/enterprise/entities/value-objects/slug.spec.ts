import { Slug } from './slug'

test('should be able to create a slug', () => {
  const slug = Slug.createFromText('this is a slug')

  // Act
  const value = slug.value

  // Assert
  expect(value).toBe('this-is-a-slug')
})
