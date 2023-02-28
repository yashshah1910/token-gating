import React from "react";
import publicConfig from "../publicConfig";
import * as fcl from "@onflow/fcl";
import { outdatedPathsMainnet } from "./mainnet_outdated_paths";
import config from "./config"; // eslint-disable-line no-unused-vars

const outdatedPaths = (network) => {
  if (network === "mainnet") {
    return outdatedPathsMainnet;
  }
};

function VerifyNft(props) {
  // --- Utils ---

  const splitList = (list, chunkSize) => {
    const groups = [];
    let currentGroup = [];
    for (let i = 0; i < list.length; i++) {
      const collectionID = list[i];
      if (currentGroup.length >= chunkSize) {
        groups.push([...currentGroup]);
        currentGroup = [];
      }
      currentGroup.push(collectionID);
    }
    groups.push([...currentGroup]);
    return groups;
  };

  // --- Storage Items ---

  const bulkGetStoredItems = async (address) => {
    const paths = await getStoragePaths(address);
    const groups = splitList(
      paths.map((p) => p.identifier),
      50
    );
    const promises = groups.map((group) => {
      return getStoredItems(address, group);
    });

    const itemGroups = await Promise.all(promises);
    const items = itemGroups.reduce((acc, curr) => {
      return acc.concat(curr);
    }, []);
    return items;
  };

  const getStoredItems = async (address, paths) => {
    const code = `
      import FungibleToken from 0xFungibleToken
      import NonFungibleToken from 0xNonFungibleToken
      import MetadataViews from 0xMetadataViews
      pub struct CollectionDisplay {
        pub let name: String
        pub let squareImage: MetadataViews.Media
        init(name: String, squareImage: MetadataViews.Media) {
          self.name = name
          self.squareImage = squareImage
        }
      }
      pub struct Item {
          pub let address: Address
          pub let path: String
          pub let type: Type
          pub let isResource: Bool
          pub let isNFTCollection: Bool
          pub let display: CollectionDisplay?
          pub let tokenIDs: [UInt64]
          pub let isVault: Bool
          pub let balance: UFix64?
      
          init(address: Address, path: String, type: Type, isResource: Bool, 
            isNFTCollection: Bool, display: CollectionDisplay?,
            tokenIDs: [UInt64], isVault: Bool, balance: UFix64?) {
              self.address = address
              self.path = path
              self.type = type
              self.isResource = isResource
              self.isNFTCollection = isNFTCollection
              self.display = display
              self.tokenIDs = tokenIDs
              self.isVault = isVault
              self.balance = balance
          }
      }
      pub fun main(address: Address, pathIdentifiers: [String]): [Item] {
        let account = getAuthAccount(address)
        let resourceType = Type<@AnyResource>()
        let vaultType = Type<@FungibleToken.Vault>()
        let collectionType = Type<@NonFungibleToken.Collection>()
        let metadataViewType = Type<@AnyResource{MetadataViews.ResolverCollection}>()
        let items: [Item] = []
        for identifier in pathIdentifiers {
          let path = StoragePath(identifier: identifier)!
          if let type = account.type(at: path) {
            let isResource = type.isSubtype(of: resourceType)
            let isNFTCollection = type.isSubtype(of: collectionType)
            let conformedMetadataViews = type.isSubtype(of: metadataViewType)
            var tokenIDs: [UInt64] = []
            var collectionDisplay: CollectionDisplay? = nil
            if isNFTCollection && conformedMetadataViews {
              if let collectionRef = account.borrow<&{MetadataViews.ResolverCollection, NonFungibleToken.CollectionPublic}>(from: path) {
                tokenIDs = collectionRef.getIDs()
                // TODO: move to a list
                if tokenIDs.length > 0 
                && path != /storage/RaribleNFTCollection 
                && path != /storage/ARTIFACTPackV3Collection
                && path != /storage/ArleeScene {
                  let resolver = collectionRef.borrowViewResolver(id: tokenIDs[0]) 
                  if let display = MetadataViews.getNFTCollectionDisplay(resolver) {
                    collectionDisplay = CollectionDisplay(
                      name: display.name,
                      squareImage: display.squareImage
                    )
                  }
                }
              }
            } else if isNFTCollection {
              if let collectionRef = account.borrow<&NonFungibleToken.Collection>(from: path) {
                tokenIDs = collectionRef.getIDs()
              }
            }
            let isVault = type.isSubtype(of: vaultType) 
            var balance: UFix64? = nil
            if isVault {
              if let vaultRef = account.borrow<&FungibleToken.Vault>(from: path) {
                balance = vaultRef.balance
              }
            }
            let item = Item(
              address: address,
              path: path.toString(),
              type: type,
              isResource: isResource,
              isNFTCollection: isNFTCollection,
              display: collectionDisplay,
              tokenIDs: tokenIDs,
              isVault: isVault,
              balance: balance
            )
            items.append(item)
          }
        }
        return items
      }
      `;

    const items = await fcl.query({
      cadence: code,
      args: (arg, t) => [
        arg(address, t.Address),
        arg(paths, t.Array(t.String)),
      ],
    });

    return items;
  };

  const getStoragePaths = async (address) => {
    const code = `
      pub fun main(address: Address): [StoragePath] {
        ${outdatedPaths(publicConfig.chainEnv).storage} 
        let account = getAuthAccount(address)
        let cleandPaths: [StoragePath] = []
        for path in account.storagePaths {
          if (outdatedPaths.containsKey(path)) {
            continue
          }
          cleandPaths.append(path)
        }
        return cleandPaths
      }
      `;

    const paths = await fcl.query({
      cadence: code,
      args: (arg, t) => [arg(address, t.Address)],
    });

    return paths;
  };

  const verifyNft = async (items, contractAddress) => {
    let arr = [];
    items.then((items) => {
      for (let key in items) {
        if (items[key]["tokenIDs"].length > 0) {
          arr.push(items[key]["type"]["typeID"].split(".Collection")[0]);
        }
      }
      let temp = arr.includes(contractAddress);
      console.log(temp);
    });
  };
  let items = bulkGetStoredItems(props.userWalletAddress);
  verifyNft(items, props.contractAddress);

  return <></>;
}

export default VerifyNft;
