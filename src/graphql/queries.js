// eslint-disable
// this is an auto generated file. This will be overwritten

export const listAllRestaurants = `query ListAllRestaurants($limit: Int, $nextToken: String) {
  listAllRestaurants(limit: $limit, nextToken: $nextToken) {
    items {
      id
      clientId
      name
      type
      description
      city
      service
    }
    nextToken
  }
}
`;
export const getRestaurant = `query GetRestaurant($id: ID!) {
  getRestaurant(id: $id) {
    id
    clientId
    name
    type
    description
    city
    service
  }
}
`;
export const listRestaurants = `query ListRestaurants(
  $filter: ModelRestaurantFilterInput
  $limit: Int
  $nextToken: String
) {
  listRestaurants(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      clientId
      name
      type
      description
      city
      service
    }
    nextToken
  }
}
`;
